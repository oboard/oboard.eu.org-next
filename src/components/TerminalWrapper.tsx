import '@xterm/xterm/css/xterm.css';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useEffect, useRef, useState } from 'react';
/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  'README.md': {
    file: {
      contents: `# oboard
Email: oboard@outlook.com
GitHub: https://github.com/oboard/
      `,
    },
  },
  'main.js': {
    file: {
      contents: `const font5x5 = {
  'O': [
    ' *** ',
    '*   *',
    '*   *',
    '*   *',
    ' *** '
  ],
  'B': [
    '**** ',
    '*   *',
    '**** ',
    '*   *',
    '**** '
  ],
  'A': [
    ' *** ',
    '*   *',
    '*****',
    '*   *',
    '*   *'
  ],
  'R': [
    '**** ',
    '*   *',
    '**** ',
    '*  * ',
    '*   *'
  ],
  'D': [
    '**** ',
    '*   *',
    '*   *',
    '*   *',
    '**** '
  ]
};

function print5x5(str) {
  const rows = [[], [], [], [], []];
  [...str.toUpperCase()].forEach(ch => {
    const pat = font5x5[ch] || font5x5[' '];   // 找不到用空格占位
    pat.forEach((line, idx) => rows[idx].push(line));
  });
  rows.forEach(r => console.log(r.join(' ')));
}

print5x5('OBOARD');
      `,
    },
  },
};

// 全局 WebContainer 实例管理
const webContainerState = {
  instance: null as any,
  isBooting: false,
};

export default function TerminalWrapper() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);

    let webcontainerInstance: any = null;
    let shellProcess: any = null;

    // 启动WebContainer和shell
    const initializeContainer = async () => {
      try {
        // 检查是否已有实例或正在启动
        if (webContainerState.instance) {
          webcontainerInstance = webContainerState.instance;
        } else if (webContainerState.isBooting) {
          // 等待启动完成
          while (webContainerState.isBooting && !webContainerState.instance) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          webcontainerInstance = webContainerState.instance;
        } else {
          // 启动新实例
          webContainerState.isBooting = true;
          // Dynamically import WebContainer to avoid SSR issues
          const { WebContainer } = await import('@webcontainer/api');
          webcontainerInstance = await WebContainer.boot({
            workdirName: 'oboard-workspace',
          });
          webContainerState.instance = webcontainerInstance;
          webContainerState.isBooting = false;
          await webcontainerInstance.mount(files);

          // 配置国内镜像源加速下载
          try {
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'registry',
              'https://registry.npmmirror.com',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'disturl',
              'https://npmmirror.com/dist',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'electron_mirror',
              'https://npmmirror.com/mirrors/electron/',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'sass_binary_site',
              'https://npmmirror.com/mirrors/node-sass/',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'phantomjs_cdnurl',
              'https://npmmirror.com/mirrors/phantomjs/',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'chromedriver_cdnurl',
              'https://npmmirror.com/mirrors/chromedriver',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'operadriver_cdnurl',
              'https://npmmirror.com/mirrors/operadriver',
            ]);
            await webcontainerInstance.spawn('npm', [
              'config',
              'set',
              'fse_binary_host_mirror',
              'https://npmmirror.com/mirrors/fsevents',
            ]);
            console.log('已配置国内镜像源，加速包下载');
          } catch (error) {
            console.warn('配置镜像源失败，将使用默认源:', error);
          }
        }

        shellProcess = await webcontainerInstance.spawn('jsh', {
          terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
          },
        });

        // 连接shell输出到终端
        shellProcess.output
          .pipeTo(
            new WritableStream({
              write(data) {
                terminal.write(data);
              },
            })
          )
          .catch((error: any) => {
            console.error('Shell输出管道错误:', error);
            terminal.writeln(`\r\n错误: Shell输出管道失败 - ${error.message}`);
          });

        // 连接终端输入到shell
        const input = shellProcess.input.getWriter();
        terminal.onData((data) => {
          input.write(data).catch((error: any) => {
            console.error('Shell输入错误:', error);
          });
        });

        setLoading(false);
        input.write('node main.js\n');
      } catch (error: any) {
        console.error('WebContainer或Shell启动失败:', error);
      }
    };

    initializeContainer();

    fitAddon.fit();

    function resizeTerminal() {
      fitAddon.fit();
    }
    window.addEventListener('resize', resizeTerminal);

    // 清理函数
    return () => {
      if (shellProcess) {
        shellProcess.kill?.();
      }
      // 不销毁全局 WebContainer 实例，让其他组件可以复用
      // if (webcontainerInstance) {
      //   webcontainerInstance.teardown?.();
      // }
      terminal.dispose();
      window.removeEventListener('resize', resizeTerminal);
    };
  }, []);

  return (
    <div className="rounded-xl p-4 bg-black h-[300px] mt-16 text-left relative">
      <div className="h-full" ref={terminalRef} />
      {loading && (
        <div className="h-full w-full left-0 top-0 absolute bg-black/50 flex items-center justify-center gap-2 px-2">
          <div className="loading loading-spinner" />
          <span>欢迎来到 oboard 的终端，正在初始化中...</span>
        </div>
      )}
    </div>
  );
}
