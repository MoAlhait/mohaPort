# Personal Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features smooth animations, dark mode support, and a professional design.

## 🚀 Features

- **Modern Design**: Clean and professional layout with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Dark Mode**: Built-in dark mode support
- **Performance**: Optimized for fast loading and smooth interactions
- **SEO Friendly**: Proper meta tags and structured data
- **Accessible**: WCAG compliant with proper semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Personal Information
Update the following files with your information:

1. **`app/layout.tsx`**: Update metadata (title, description, etc.)
2. **`app/page.tsx`**: Update personal details, skills, and projects
3. **`package.json`**: Update author information

### Styling
- **Colors**: Modify the color palette in `tailwind.config.js`
- **Fonts**: Change fonts in `tailwind.config.js` and `globals.css`
- **Layout**: Adjust spacing and layout in the component files

### Content
- **Skills**: Update the skills array in `app/page.tsx`
- **Projects**: Replace the sample projects with your own
- **Social Links**: Update social media links and contact information

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Other Platforms
The project can be deployed to any platform that supports Next.js static exports.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

If you have any questions or suggestions, feel free to reach out:

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

---

Made with ❤️ using Next.js and Tailwind CSS 