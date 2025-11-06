# Project C - Interactive 3D Audio-Visual Experience

An immersive interactive 3D application based on **three.js**, **p5.js**, and **socket.io** with WebXR (VR/AR) support, real-time audio visualization, and multi-user collaboration.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

---

## Features

### 3D Visualization
- Real-time 3D rendering with **three.js**
- Dynamic geometry (cubes, spheres, ring structures)
- Real-time shadows and lighting effects
- Material and texture mapping

### Audio Interaction
- **p5.js** audio analysis and processing
- Real-time volume detection and visualization
- Pitch detection and frequency analysis
- Multi-track audio playback system
- Audio-driven 3D animation effects

### WebXR Support
- Native WebXR API integration
- VR/AR device compatibility
- Controller interaction and ray selection
- Immersive virtual environment

### Real-time Collaboration
- **socket.io** real-time bidirectional communication
- Multi-user synchronization
- Event broadcasting and receiving
- Low-latency data transmission

### Visual Effects
- Particle system (petal animation)
- Dynamic ring deformation
- Material glow effects
- Background texture mapping

---

## Tech Stack

- **Frontend**: vanilla JavaScript
- **3D Engine**: three.js (v0.156.1)
- **Audio Processing**: p5.js + p5.sound
- **Real-time Communication**: socket.io (v4.7.2)
- **Backend**: Node.js + Express
- **WebXR**: Native WebXR API
- **SSL/TLS**: HTTPS Server

---

## Project Structure

```
Project C/
├── server.js                 # Main server file (Express + HTTPS)
├── package.json              # Dependencies and scripts
├── cert.pem                  # SSL certificate
├── key.pem                   # SSL private key
├── README.md                 # Project documentation
└── public/                   # Static assets directory
    ├── index.html            # Main page
    ├── css/
    │   └── style.css         # Stylesheet
    ├── js/                   # JavaScript modules
    │   ├── main.js           # Main controller and Three.js scene
    │   ├── script-three.js   # Three.js initialization
    │   ├── script-webxr.js   # WebXR functionality
    │   ├── script-p5.js      # p5.js audio processing
    │   └── script-socket.js  # Socket.io communication
    └── assets/               # Media assets
        ├── bg.mp3            # Background music
        ├── Drum.mp3          # Drum audio
        ├── H1.mp3 ~ H12.mp3  # Interactive sound effects
        ├── Bell.mp3          # Bell sound effects
        ├── ORC1.mp3 ~ ORC8.mp3 # Orchestral sound effects
        ├── petal.obj         # Petal 3D model
        └── background/       # Texture files
            ├── brick.png
            ├── ceiling.png
            └── floor.jpeg
```

---

## Quick Start

### Prerequisites

- **Node.js** >= 14.0.0
- **npm** or **yarn**
- Modern browser (Chrome 80+, Firefox 75+, Safari 13.1+)
- Chrome recommended for best WebXR support

### Installation

1. **Clone or download the project**
```bash
cd "/Users/minimax/Downloads/Project C"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Access the application**

After the server starts, open your browser to the address shown in the console, e.g.:
```
https://YOUR_IP_ADDRESS:3000
```

For example:
```
https://192.168.1.100:3000
```

---

## Usage

### Basic Controls

| Key/Action | Function |
|------------|----------|
| `Space` | Generate new petal particles |
| `S` | Play/Stop background music |
| `0-8` | Trigger different sound effects |
| Mouse drag | Rotate camera view |
| Scroll wheel | Zoom in/out |

### VR/AR Mode

1. Click the **"ENTER VR"** button on the page
2. Wear your VR headset
3. Use controllers to aim and trigger interactions
4. Ray indicators show interaction points

### Audio Interaction

- **Volume sensing**: Ambient volume affects 3D object scaling
- **Pitch sensing**: Pitch affects ring structure deformation
- **Trigger sound effects**: Clicking 3D objects plays corresponding sounds

### Multi-user Collaboration

- Multiple clients can connect to the same server simultaneously
- Any client's interaction will be broadcast to other users
- Real-time synchronization of petal generation and audio playback

---

## Configuration

### server.js Configuration

```javascript
// Change port
const port = 3000;  // Modify to desired port

// Modify CORS settings
cors: {
  origin: "*",              // Allowed origins
  methods: ["GET", "POST"],
  credentials: true
}

// Use HTTP instead of HTTPS (dev only)
// const server = http.createServer(app);
```

### main.js Configuration

```javascript
// World size
let WORLD_HALF = 10;  // Affects scene scale

// Petal count
for (let i = 0; i < 30; i++) {  // Modify petal generation count
  // ...
}
```

---

## Troubleshooting

### Common Issues

**Q: Browser shows "insecure connection" warning?**
> A: This is normal for self-signed certificates. Click "Advanced" -> "Continue to website".

**Q: VR mode won't start?**
> A: Ensure using a WebXR-supported browser and device. Chrome recommended. Test in HTTPS environment.

**Q: Audio won't play?**
> A: Modern browsers require user interaction before playing audio. Click anywhere on the page to activate audio.

**Q: Socket.io connection failed?**
> A: Check firewall settings, ensure port 3000 is open. Verify server console for error messages.

**Q: 3D model or texture loading failed?**
> A: Ensure all files exist in `public/assets/` directory and paths are correct.

### Debug Mode

Enable detailed logging:
```javascript
// In server.js
io.on("connection", newConnection);
function newConnection(sck) {
  console.log("✓ New connection:", sck.id);
  sck.on("connection_name", (data) => {
    console.log("📨 Received:", data);
    sck.broadcast.emit("connection_name", data);
  });
}
```

---

## Development Guide

### Adding New Features

1. **New 3D Object**
```javascript
// Add function in main.js
function getCustomObject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
```

2. **New Sound Effect**
```javascript
// Add in script-p5.js
let soundFilenames = [
  "your-sound.mp3",  // Add new sound file
  // ...
];

// Preload
sounds.push(loadSound("assets/your-sound.mp3"));
```

3. **New Socket Event**
```javascript
// Server side (server.js)
io.on("connection", (socket) => {
  socket.on("custom_event", (data) => {
    // Handle event
    socket.broadcast.emit("custom_event", data);
  });
});

// Client side (script-socket.js)
function sendCustom(data) {
  socket.emit("custom_event", data);
}
```

---

## Performance Optimization

1. **Lower rendering quality** (mobile devices)
```javascript
// In script-three.js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

2. **Reduce particle count**
```javascript
// In main.js
for (let i = 0; i < 10; i++) {  // Reduce from 30 to 10
  // ...
}
```

3. **Optimize shadows**
```javascript
renderer.shadowMap.enabled = false;  // Disable shadows (significant performance boost)
```

---

## License

This project is open source under the [ISC License](https://opensource.org/licenses/ISC).

---

## Acknowledgments

- [three.js](https://threejs.org/) - 3D graphics library
- [p5.js](https://p5js.org/) - Creative coding library
- [socket.io](https://socket.io/) - Real-time communication library
- [Express](https://expressjs.com/) - Web framework

---

