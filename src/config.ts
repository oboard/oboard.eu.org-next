export const ability = [
  {
    name: "Web",
    description: "Web 前端开发",
    children: [
      {
        icon: "i-logos-react",
        name: "React",
      },
      {
        icon: "i-logos-vue",
        name: "Vue",
      },
      {
        icon: "i-logos-nextjs-icon",
        name: "Next.js",
      },
      {
        icon: "i-logos-nuxt-icon",
        name: "Nuxt.js",
      },
      {
        icon: "i-logos-typescript-icon",
        name: "TypeScript",
      },
      {
        icon: "i-logos-javascript",
        name: "JavaScript",
      },
      {
        icon: "i-logos-tailwindcss-icon",
        name: "Tailwind CSS",
      },
      {
        icon: "i-logos-unocss",
        name: "UnoCSS",
      },
      {
        icon: "i-logos-adobe-illustrator",
        name: "Illustrator",
      },
      {
        icon: "i-logos-moonbit",
        name: "MoonBit",
      },
      
    ],
  },
  {
    name: "App",
    description: "App 开发",
    children: [
      {
        icon: "i-logos-flutter",
        name: "Flutter",
      },
      {
        icon: "i-logos-dart",
        name: "Dart",
      },
      {
        icon: "i-logos-android-icon",
        name: "Android",
      },
      {
        icon: "i-logos-kotlin-icon",
        name: "Kotlin",
      },
      {
        icon: "i-logos-java",
        name: "Java",
      },
      {
        icon: "i-logos-ios",
        name: "iOS",
      },
      {
        icon: "i-logos-swift",
        name: "Swift",
      },
    ],
  },
  {
    name: "AI",
    description: "人工智能",
    children: [
      {
        icon: "i-logos-python",
        name: "Python",
      },
      {
        icon: "i-logos-tensorflow",
        name: "TensorFlow",
      },
      {
        icon: "i-logos-pytorch-icon",
        name: "PyTorch",
      },
    ],
  },
  {
    name: "Design",
    description: "设计",
    children: [
      {
        icon: "i-logos-blender",
        name: "Blender",
      },
      {
        icon: "i-logos-adobe-photoshop",
        name: "Photoshop",
      },
      {
        icon: "i-logos-adobe-premiere",
        name: "Premiere Pro",
      },
      {
        icon: "i-logos-adobe-after-effects",
        name: "After Effects",
      },
      {
        icon: "i-logos-adobe-illustrator",
        name: "Illustrator",
      },
    ],
  },
];

export interface Link {
  name: string;
  url: string;
  avatar?: string;
}

export interface LinkGroup {
  name: string;
  children: Link[];
}

export const links: LinkGroup[] = [
  {
    name: "资源导航",
    children: [
      {
        name: "Android x86 下载",
        url: "https://www.android-x86.org/download",
        avatar: "https://www.android.com/static/images/logos/andy-sm.png",
      },
      {
        name: "Windows 下载",
        url: "https://msdn.itellyou.cn/",
        avatar: "https://c.s-microsoft.com/favicon.ico",
      },
      {
        name: "Manjaro 下载",
        url: "https://manjaro.org/download/",
        avatar: "https://manjaro.org/logo.svg",
      },
    ],
  },
  {
    name: "友谊链接",
    children: [
      {
        name: "Rinne",
        url: "https://www.rinne.in/",
        avatar: "https://avatars.githubusercontent.com/u/180847792",
      },
      {
        name: "Opacity",
        url: "https://opacity.ink",
        avatar: "https://www.opacity.ink/images/avatar.jpg",
      },
      {
        name: "Yorkin",
        url: "https://yoorkin.github.io/",
        avatar: "https://avatars.githubusercontent.com/u/29514144",
      },
      {
        name: "9BIE",
        url: "https://9bie.org/",
        avatar: "https://avatars.githubusercontent.com/u/12439321",
      },
      {
        name: "XXS",
        url: "https://xxs2.cn",
        avatar: "https://blog-1252515394.cos.ap-shanghai.myqcloud.com/wp-content/uploads/2024/10/f43d530dae434d112fa071eb6e09050c.png",
      },
      {
        name: "Songyuli",
        url: "https://lsyxiaopang.github.io",
        avatar: "https://avatars.githubusercontent.com/u/28998097",
      },
    ],
  },
];