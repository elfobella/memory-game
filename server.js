const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Static dosyaları serve et
app.use(express.static('.'));

// Oyun durumu
let gameState = {
    players: [],
    gameStarted: false,
    currentPlayerIndex: 0,
    cards: [],
    gameTimer: null,
    totalMatchedPairs: 0
};

// Kart ikonları
const cardIcons = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
];

// Kartları oluştur
function createCards() {
    const pairs = 8; // 8 çift = 16 kart
    const cards = [];
    
    for (let i = 0; i < pairs; i++) {
        cards.push({
            icon: cardIcons[i],
            id: i,
            matched: false
        });
        cards.push({
            icon: cardIcons[i],
            id: i,
            matched: false
        });
    }
    
    // Kartları karıştır
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
}

// Oyunu başlat
function startGame() {
    if (gameState.players.length >= 2 && gameState.players.every(p => p.ready)) {
        gameState.gameStarted = true;
        gameState.cards = createCards();
        gameState.currentPlayerIndex = 0;
        gameState.totalMatchedPairs = 0;
        
        io.emit('gameStarted', {
            players: gameState.players,
            currentPlayerId: gameState.players[gameState.currentPlayerIndex].id,
            cards: gameState.cards
        });
        
        // 5 dakika oyun süresi
        gameState.gameTimer = setTimeout(() => {
            endGame();
        }, 300000);
    }
}

// Oyunu bitir
function endGame() {
    const finalScores = gameState.players.map(player => ({
        id: player.id,
        name: player.name,
        score: player.score || 0,
        moves: player.moves || 0,
        time: player.time || 0
    }));
    
    io.emit('gameEnded', { finalScores });
    
    // Oyun durumunu sıfırla
    gameState.players.forEach(player => {
        player.score = 0;
        player.moves = 0;
        player.time = 0;
        player.ready = false;
    });
    gameState.gameStarted = false;
    gameState.currentPlayerIndex = 0;
    gameState.totalMatchedPairs = 0;
    
    if (gameState.gameTimer) {
        clearTimeout(gameState.gameTimer);
        gameState.gameTimer = null;
    }
}

// Sıradaki oyuncuya geç
function nextPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    io.emit('turnChanged', {
        currentPlayerId: gameState.players[gameState.currentPlayerIndex].id
    });
}

// Socket.io bağlantıları
io.on('connection', (socket) => {
    console.log('Yeni oyuncu bağlandı:', socket.id);
    
    // Oyuncu oyuna katıldı
    socket.on('joinGame', (data) => {
        const player = {
            id: socket.id,
            name: data.playerName,
            ready: false,
            score: 0,
            moves: 0,
            time: 0
        };
        
        gameState.players.push(player);
        
        // Tüm oyunculara bildir
        io.emit('playerJoined', {
            playerName: player.name,
            players: gameState.players
        });
        
        // Yeni oyuncuya mevcut oyuncuları gönder
        socket.emit('playersList', { players: gameState.players });
    });
    
    // Oyuncu hazırlık durumunu değiştirdi
    socket.on('toggleReady', (data) => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (player) {
            player.ready = data.ready;
            
            io.emit('playerReadyChanged', {
                players: gameState.players
            });
            
            // Oyunu başlatmayı dene
            if (!gameState.gameStarted) {
                startGame();
            }
        }
    });
    
    // Kart çevrildi
    socket.on('flipCard', (data) => {
        if (gameState.gameStarted && gameState.players[gameState.currentPlayerIndex].id === socket.id) {
            io.emit('cardFlipped', {
                cardIndex: data.cardIndex,
                playerId: socket.id
            });
        }
    });
    
    // Kartlar eşleşti
    socket.on('cardsMatched', (data) => {
        if (gameState.gameStarted) {
            const player = gameState.players.find(p => p.id === socket.id);
            if (player) {
                player.score += 10;
                player.moves++;
            }
            
            // Global eşleşme sayısını artır
            gameState.totalMatchedPairs++;
            
            io.emit('cardsMatched', {
                cardIndices: data.cardIndices,
                playerId: socket.id
            });
            
            console.log(`Cards matched! Total pairs: ${gameState.totalMatchedPairs}/8`);
            
            // Oyun bitti mi kontrol et
            if (gameState.totalMatchedPairs >= 8) {
                console.log('All cards matched! Ending game...');
                endGame();
                return;
            }
            
            // Eşleşme varsa aynı oyuncu devam eder, yoksa sıra geçer
            // Bu basit implementasyonda her zaman sıra geçiyor
            setTimeout(() => {
                nextPlayer();
            }, 1000);
        }
    });
    
    // Kartlar sıfırlandı
    socket.on('cardsReset', () => {
        if (gameState.gameStarted) {
            io.emit('cardsReset');
            nextPlayer();
        }
    });
    
    // Oyun tamamlandı (artık kullanılmıyor, server kendisi kontrol ediyor)
    
    // Chat mesajı
    socket.on('chatMessage', (data) => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (player) {
            io.emit('chatMessage', {
                senderName: player.name,
                message: data.message
            });
        }
    });
    
    // Oyuncu oyundan ayrıldı
    socket.on('leaveGame', () => {
        const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
            const player = gameState.players[playerIndex];
            gameState.players.splice(playerIndex, 1);
            
            // Eğer ayrılan oyuncu sıradaki oyuncuysa, sırayı ayarla
            if (gameState.currentPlayerIndex >= playerIndex && gameState.currentPlayerIndex > 0) {
                gameState.currentPlayerIndex--;
            }
            
            io.emit('playerLeft', {
                playerName: player.name,
                players: gameState.players
            });
            
            // Eğer oyuncu sayısı 1'den azsa oyunu bitir
            if (gameState.players.length < 2 && gameState.gameStarted) {
                endGame();
            }
        }
    });
    
    // Oyuncu bağlantısı kesildi
    socket.on('disconnect', () => {
        console.log('Oyuncu ayrıldı:', socket.id);
        
        const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
            const player = gameState.players[playerIndex];
            gameState.players.splice(playerIndex, 1);
            
            io.emit('playerLeft', {
                playerName: player.name,
                players: gameState.players
            });
            
            // Eğer oyuncu sayısı 1'den azsa oyunu bitir
            if (gameState.players.length < 2 && gameState.gameStarted) {
                endGame();
            }
        }
    });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'multiplayer-memory-game.html'));
});

// Port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server is running on port ${PORT}`);
});
