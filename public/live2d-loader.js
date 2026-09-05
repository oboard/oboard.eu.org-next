// 在浏览器中运行的 Live2D 加载脚本；通过 script 标签加载，避开 Next 的服务端/客户端模块解析。
import { loadOml2d } from '/Resources/oh-my-live2d.js';

if (document.getElementById('oml2d-canvas')) {
  // 已经存在
} else {
  const oml2d = loadOml2d({
    dockedPosition: 'right',
    sayHello: false,
    menus: {
      disable: true,
      items: [],
    },
    models: [
      {
        path: '/Resources/三月七/三月七.model3.json',
        scale: 0.08,
        position: [0, 120],
        stageStyle: {
          height: 450,
        },
      },
    ],
  });

  oml2d.onLoad((status) => {
    if (status === 'success') {
      const canvas = document.getElementById('oml2d-canvas');
      if (canvas) {
        canvas.addEventListener('click', () => {
          oml2d.stageSlideOut();
          oml2d.statusBarOpen('显示看板娘');
          oml2d.clearTips();
          oml2d.setStatusBarClickEvent(() => {
            oml2d.stageSlideIn();
            oml2d.statusBarClose();
          });
        });
      }
    }
  });
}