import '@xterm/xterm/css/xterm.css';
import { Terminal } from '@xterm/xterm';
import { WebContainer } from '@webcontainer/api';
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
        webcontainerInstance = await WebContainer.boot({
          workdirName: 'oboard-workspace'
        });
        await webcontainerInstance.mount(files);
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
      if (webcontainerInstance) {
        webcontainerInstance.teardown?.();
      }
      terminal.dispose();
      window.removeEventListener('resize', resizeTerminal);
    };
  }, []);

  return (
    <div className="rounded-xl p-4 bg-black h-[300px] mt-16 text-left relative">
      <div ref={terminalRef} />
      {loading && (
        <div className="h-full w-full left-0 top-0 absolute bg-black/50 flex items-center justify-center gap-2 px-2">
          <div className="loading loading-spinner" />
          <span>欢迎来到 oboard 的终端，正在初始化中...</span>
        </div>
      )}
    </div>
  );
}
