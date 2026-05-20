# 🎹 疯狂钢琴 / Crazy Piano

[简体中文](#简体中文) | [English](#english)

---

## 简体中文

点击并体验这款专为音乐爱好者与休闲玩家打造的**宠物钢琴节奏街机游戏**。游戏包含两个独具一格、细节拉满的视觉主题（**赛博鸭 Cyber Duck** 与 **梦幻猪 Dreamy Pig**），并在经典的下落式/滚动式键盘音乐游戏（Rhythm/Piano Game）中融入了生动的宠物角色动画反馈、高保真动态音效以及极具挑战性的节奏扣杀系统。

### ✨ 核心特色

1. **双重梦幻主题（一键瞬切）**
   * **赛博鸭 (Cyber Duck)**：迷离的霓虹光效、深色极简赛博板、绚丽的青色与紫红离子流。
   * **梦幻猪 (Dreamy Pig)**：温暖清新的粉红马卡龙配色、浪漫的气泡粒子、温馨治愈的午后感官体验。
2. **滚动敲击谱流 (Scrolling Note-Sheet)**
   * 采用卡片横向流动的乐谱模式。每个音符圈内不仅印有简谱音名（如 Do/Re/Mi），还有对应的精确唱名（如 C4, D#4）。
   * 搭载专门为物理键盘（控制 A 到 K）定制的绑定悬浮提示。
   * 带有倒计时的智能律动计时条。
3. **真实高保真音频合成**
   * 基于 Web Audio API 实现的实时正弦波/三角波高保真钢琴音效。不需要加载庞大的 MP3/WAV 音频文件，响应敏捷，延迟趋近于零。
4. **大师双重试炼模式**
   * **实战演奏模式 (Interactive Challenge)**：经典血条（❤ 心心生命值）、连击加成机制（Combo Multiplier）、单音符高空倒计时，错音或超时均会扣减生命，极度考验反应力！
   * **优雅自动演化 (Autoplay Mode)**：可随时“一键躺平”让 AI/系统接管并进行流畅的完美自动演奏，供您静享音乐旋律或熟记谱表。
5. **严谨的版权金曲库 (精心裁剪最知名旋律)**
   * **简单 (Easy)**：《两只老虎》《小星星》《欢乐颂》《生日快乐歌》
   * **一般 (Normal)**：周杰伦经典副歌主旋律——《晴天》《青花瓷》《告白气球》《菊花台》
   * **困难 (Hard)**：炫技古典及交响巅峰——《致爱丽丝》《卡农》《土耳其进行曲》《命运交响曲》
6. **精致细节与响应式适配**
   * 物理键盘完美的重音律动、音量平滑控制、沉浸式暂停菜单、实时最高分（Highscore）本地自动持久化保存。

---

### 🎮 玩法指引与物理键盘对照表

在游戏内，你可以点击屏幕上的拟真琴键，也可以直接通过**电脑物理键盘**操作。键盘的按键与钢琴琴键从左至右呈线性完美对接：

* **白键对照：**
  * `A` 对应 1 (C4 - Do)
  * `S` 对应 2 (D4 - Re)
  * `D` 对应 3 (E4 - Mi)
  * `F` 对应 4 (F4 - Fa)
  * `G` 对应 5 (G4 - Sol)
  * `H` 对应 6 (A4 - La)
  * `J` 对应 7 (B4 - Si)
  * `K` 对应 1̇ (C5 - High Do)
* **半音黑键对照：**
  * `W` 对应 C#4 (#1)
  * `E` 对应 D#4 (#2)
  * `T` 对应 F#4 (#4)
  * `Y` 对应 G#4 (#5)
  * `U` 对应 A#4 (#6)

#### 📝 双重模式玩法详情：
1. **实战（挑战模式）：** 观察“敲击谱流”中下一个处于高亮呼吸状态的音符，在倒计时进度条走完之前按下对应的唱名或物理按键。
2. **通关奖励：** 连击数（Streak）越高，每一次正确敲击获得的分数加成叠加越快！演奏完整首歌曲即可斩获通关 bonus！

---

### 🚀 运行与构建指引

本项目基于 **React + Vite + Tailwind CSS** 开发。按照以下命令可在本地拉起服务：

#### 1. 安装依赖包
```bash
npm install
```

#### 2. 本地开发运行 (热重载)
```bash
npm run dev
```
运行后在浏览器打开交互服务：`http://localhost:3000`

#### 3. 生产打包生产包
```bash
npm run build
```
打包后生成的静态资源文件将统一位于 `dist/` 目录，您可以非常方便地将其拖拽部署到 GitHub Pages、Vercel 等托管平台上。

---
---

## English

Welcome to **Crazy Piano**, a highly responsive, polished, and addictive **Pet Piano Arcade Rhythm Game** catering to both music veterans and casual players. Crafted with two distinct premium themes (**Cyber Duck** & **Dreamy Pig**), this game merges traditional keyboard rhythm-action gameplay with fluid character animation feedback, latency-free synthesized audio, and aggressive streak combinations.

### ✨ Key Features

1. **Dual Visual Identities (Instant Toggle)**
   * **Cyber Duck**: Atmospheric cyberpunk twilight backdrop, pulsing neon indicators, sleek dark controls, and glowing cyan cyan sparkles.
   * **Dreamy Pig**: Romantic bubble streams, pastel peach accents, soft clouds, and a heartwarming aesthetic.
2. **Scrolling Active Note-Sheet**
   * Features a horizontal sliding music staff. Each circle clearly depicts its corresponding solfege (Do/Re/Mi) and keyboard bindings.
   * An intuitive linear countdown timer tracks your remaining reaction window per syllable.
3. **Zero-Latency Audio Synthesis**
   * Powered by the native Web Audio API utilizing dual-oscillator frequency routing. No massive static music files to fetch, resulting in light-fast response rates under 5ms.
4. **Multiple Modes of Engagement**
   * **Interactive Challenge (Play Modality)**: Features three retry heart reservoirs, an intense streak combo point multiplier, and high-stakes speed levels. Missed beats or mistapped keys reduce your health.
   * **Autonomous Autoplay**: Allows the system to elegantly and flawlessly render the song, serving as an outstanding learning utility or a relaxing instrumental player.
5. **Proportional Hit Melodies (No Cuts or Abrupt Halts)**
   * **Easy**: *Two Tigers*, *Twinkle Twinkle Little Star*, *Ode to Joy*, *Happy Birthday*.
   * **Normal**: The finest melody sections of popular Jay Chou classics - *Sunny Day*, *Blue and White Porcelain*, *Love Confession*, *Chrysanthemum Terrace*.
   * **Hard**: Exquisite adaptations of historic piano masterworks - *Für Elise*, *Canon*, *Turkish March*, *Symphony No. 5*.
6. **Detailed Adjustments**
   * Smooth volume envelope attenuation, responsive layout scaling for ultra-wide and mobile devices, immersive focus system overlays, and automatic local high-score persistence storage.

---

### 🎮 Gameplay & Keyboard Reference Map

You can click/tap on the interactive keys using a mouse/touchscreen, or press matching keys on your **physical computer keyboard** for a real piano experience:

* **White Keys:**
  * `A` -> 1 (C4 - Do)
  * `S` -> 2 (D4 - Re)
  * `D` -> 3 (E4 - Mi)
  * `F` -> 4 (F4 - Fa)
  * `G` -> 5 (G4 - Sol)
  * `H` -> 6 (A4 - La)
  * `J` -> 7 (B4 - Si)
  * `K` -> 1̇ (C5 - High Do)
* **Black Keys (Semitiones / Accidentals):**
  * `W` -> C#4 (#1)
  * `E` -> D#4 (#2)
  * `T` -> F#4 (#4)
  * `Y` -> G#4 (#5)
  * `U` -> A#4 (#6)

#### 📝 Play Mechanics:
1. Focus your gaze on the scrolling note staff to register the active breathing note.
2. Strike the corresponding key before the real-time countdown progress bar slips to zero.
3. Keep your streak chain alive! High streaks will dramatically escalate your point gain per note.

---

### 🚀 Getting Started

The application is built on **React + Vite + Tailwind CSS**.

#### 1. Setup Dependencies
```bash
npm install
```

#### 2. Launch Local Dev Server (HMR supported)
```bash
npm run dev
```
Then visit the dev build in your browser at: `http://localhost:3000`

#### 3. Compile Production Bundle
```bash
npm run build
```
The asset bundle will be compiled inside the `/dist` output directory, fully prepared for deployment on GitHub Pages, Vercel, Netlify, or any static hosting container!
