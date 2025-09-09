<div align="center">
<h1>🤖 AgentricAI Core</h1>
<p><em>Local-First AI Platform with SDXL & Ollama Integration</em></p>
</div>

# AgentricAI Core Final - Enhanced with SDXL & Ollama

This is the enhanced version of AgentricAI Core featuring **local SDXL image generation** and **Ollama LLM integration** for completely offline AI capabilities.

## 🚀 New Features

### SDXL Agent Final
- **Local Image Generation**: Stable Diffusion XL 1.0 with safetensor model support
- **Background Processing**: Non-blocking image generation workflow
- **Model Support**: 
  - agentricaiAdult_v10.safetensors
  - agentricaiPrimalxl_v10.safetensors
- **Graceful Error Handling**: Comprehensive error management and recovery

### Ollama Integration
- **Local LLM**: AgentricAI_TLM model integration
- **No API Dependencies**: Completely offline operation
- **Chat Completion**: Advanced conversation capabilities
- **Prompt Enhancement**: AI-powered prompt optimization

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Ollama** installed and running
- **Safetensor Models** placed in the `models` directory
- **8GB+ RAM** recommended for optimal performance

## 🛠️ Quick Start

### Option 1: Use the Enhanced Launcher (Recommended)
1. **Run the launcher**: Double-click `launch.bat`
   - Automatically validates environment
   - Checks for models and Ollama
   - Installs dependencies if needed
   - Launches the application

### Option 2: Manual Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup your models**:
   - Place your `.safetensors` files in the `models/` directory
   - Ensure Ollama is running: `ollama serve`
   - Load your AgentricAI_TLM model: `ollama run AgentricAI_TLM`

3. **Configure environment** (optional):
   - Set `GEMINI_API_KEY` in `.env.local` for cloud agents
   - Local agents work without API keys

4. **Start the application**:
   ```bash
   npm run dev
   # or
   npm start
   ```

## 📁 Directory Structure

```
AgentricAI_Core_Final/
├── launch.bat              # Enhanced launcher with full validation
├── models/                 # Place your .safetensors files here
├── generated_images/       # SDXL output directory
├── temp/                   # Temporary processing files
├── Agents/
│   └── SDXL Agent Final/   # Complete SDXL agent implementation
│       ├── SDXL Agent.json
│       ├── Coms.ts
│       ├── Data.ts
│       └── Utils.ts
├── AgentricAI_Core/
│   └── services/
│       └── ollamaService.ts # Ollama integration service
└── ... (existing structure)
```

## 🎮 Usage

### Image Generation
1. Select "SDXL Agent Final" from the agent list
2. Provide text prompt for image generation
3. Specify parameters (optional):
   - Dimensions (up to 2048x2048)
   - Steps (1-100)
   - Guidance (1-20)
   - Model selection

### LLM Chat
1. Use any agent that supports text generation
2. Prompts are automatically routed to local Ollama
3. No internet connection required

### Model Management
- Models are loaded automatically on first use
- Background processing handles multiple requests
- Graceful error recovery with detailed logging

## ⚙️ Configuration

### SDXL Settings
- **Max Concurrent Jobs**: 2 (configurable)
- **Default Resolution**: 1024x1024
- **Supported Formats**: PNG, JPG, WebP
- **Memory Optimization**: Enabled by default

### Ollama Settings  
- **Endpoint**: http://localhost:11434
- **Model**: AgentricAI_TLM
- **Timeout**: 30 seconds
- **Temperature**: 0.7 (configurable)

## 🔧 Troubleshooting

### Common Issues
1. **Models not found**: Ensure `.safetensors` files are in `models/` directory
2. **Ollama connection failed**: Check if Ollama service is running
3. **Memory issues**: Close other applications, ensure 8GB+ available
4. **Generation timeout**: Increase timeout in agent configuration

### Logs and Debugging
- Application logs: Check developer console (F12)
- SDXL agent logs: Monitor background processing status
- Ollama logs: `ollama logs` command
- Launch validation: Detailed output in launch.bat console

## 🏆 Performance Tips

1. **Use SSD storage** for faster model loading
2. **Close unnecessary applications** to free RAM
3. **Use lower steps** (10-15) for faster generation
4. **Enable memory optimization** in SDXL configuration

## 🔒 Local-First Design

This enhanced version is designed for **complete offline operation**:
- No cloud API calls required for core functionality
- All AI processing happens locally
- Models and data stay on your machine
- Enhanced privacy and security

## 🆕 What's New in Final

✅ **Complete SDXL Agent** with safetensor loading  
✅ **Ollama LLM Integration** for local text generation  
✅ **Enhanced Launch System** with comprehensive validation  
✅ **Background Processing** for better user experience  
✅ **Graceful Error Handling** throughout the application  
✅ **Local-Only Operation** with no API dependencies  
✅ **Comprehensive Documentation** and troubleshooting guides

---

Built with ❤️ for local-first AI development

For issues and support, please check the troubleshooting section above or review the enhanced launcher output for detailed diagnostic information.
