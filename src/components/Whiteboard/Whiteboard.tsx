import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-with-erasing';
import { whiteboardProps, mouseProps, tools, oProps } from './types';
import styles from './Whiteboard.less';
const Whiteboard: React.FC<whiteboardProps> = ({
  currentTool,
  strokeColor,
}) => {
  const canvasRef = useRef<any>(null); // FabricCanvas
  // const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const isDrawingMode = useRef<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(1);
  const mouseFrom = useRef<mouseProps>({ x: 0, y: 0 });
  const mouseTo = useRef<mouseProps>({ x: 0, y: 0 });
  const drawingObject = useRef(null);
  const textObject = useRef<any>(null);
  const toolRef = useRef<tools>(tools.pen);
  const strokeColorRef = useRef<string>('#000');

  const startDrawingObject = (canvasObject: any) => {
    canvasObject.selectable = false;
    if (drawingObject.current) {
      canvasRef.current.remove(drawingObject.current);
    }
    canvasRef.current.add(canvasObject);
    drawingObject.current = canvasObject;
  };

  const initEraser = () => {
    const icanvas = canvasRef.current;
    icanvas.freeDrawingBrush = new fabric.EraserBrush(icanvas);
    icanvas.freeDrawingBrush.width = parseInt('1', 10);
    icanvas.isDrawingMode = true;
  };

  const initPen = () => {
    canvasRef.current.freeDrawingBrush = new fabric.PencilBrush(
      canvasRef.current,
    );
    canvasRef.current.isDrawingMode = true;
  };
  const initLine = () => {
    console.log('initLine');
    let canvasObject = new fabric.Line(
      [
        mouseFrom.current.x,
        mouseFrom.current.y,
        mouseTo.current.x,
        mouseTo.current.y,
      ],
      {
        fill: '#000',
        stroke: strokeColorRef.current,
        strokkeWidth: 1,
      },
    );
    startDrawingObject(canvasObject);
  };
  const initRect = () => {
    let left = Math.min(mouseFrom.current.x, mouseTo.current.x);
    let top = Math.min(mouseFrom.current.y, mouseTo.current.y);
    let width = Math.abs(mouseFrom.current.x - mouseTo.current.x);
    let height = Math.abs(mouseFrom.current.y - mouseTo.current.y);
    let canvasObject = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      stroke: strokeColorRef.current,
      fill: 'transparent',
      strokeWidth: 1,
    });
    startDrawingObject(canvasObject);
  };

  const initEllipse = () => {
    let left = Math.min(mouseFrom.current.x, mouseTo.current.x);
    let top = Math.min(mouseFrom.current.y, mouseTo.current.y);
    let canvasObject = new fabric.Ellipse({
      left: left,
      top: top,
      stroke: '#000',
      fill: 'rgba(255, 255, 255, 0)',
      rx: Math.abs(left - Math.max(mouseFrom.current.x, mouseTo.current.x)) / 2,
      ry: Math.abs(top - Math.max(mouseFrom.current.y, mouseTo.current.y)) / 2,
      strokeWidth: 1,
    });
    startDrawingObject(canvasObject);
  };
  const initCircle = () => {
    let left = Math.min(mouseFrom.current.x, mouseTo.current.x);
    let top = Math.min(mouseFrom.current.y, mouseTo.current.y);
    let radius =
      Math.sqrt(
        (mouseTo.current.x - mouseFrom.current.x) *
          (mouseTo.current.x - mouseFrom.current.x) +
          (mouseTo.current.y - mouseFrom.current.y) *
            (mouseTo.current.y - mouseFrom.current.y),
      ) / 2;
    let canvasObject = new fabric.Circle({
      left: left,
      top: top,
      stroke: '#00f',
      fill: 'transparent',
      radius: radius / 2,
      strokeWidth: 1,
    });
    startDrawingObject(canvasObject);
  };
  const initMove = () => {};
  const initText = () => {
    if (!textObject?.current) {
      textObject.current = new fabric.Textbox('', {
        left: mouseFrom.current.x,
        top: mouseFrom.current.y,
        fontSize: 16,
        fill: '#000',
        hasControls: false,
        editable: true,
        width: 30,
        backgroundColor: 'transparent',
        selectable: false,
      });
      canvasRef.current.add(textObject.current);
      // 文本打开编辑模式
      textObject.current.enterEditing();
      // 文本编辑框获取焦点
      textObject.current.hiddenTextarea.focus();
    } else {
      // 将当前文本对象退出编辑模式
      textObject.current.exitEditing();
      textObject.current.set('backgroundColor', 'rgba(0,0,0,0)');
      if (textObject.current.text == '') {
        canvasRef.current.remove(textObject.current);
      }
      canvasRef.current.renderAll();
      textObject.current = null;
      return;
    }
  };
  // const getTransformedPosX = (x: number) => {
  //   let zoom = Number(canvasRef.current.getZoom());
  //   return (x - canvasRef.current.viewportTransform[4]) / zoom;
  // };
  // const getTransformedPosY = (x: number) => {
  //   let zoom = Number(canvasRef.current.getZoom());
  //   return (x - canvasRef.current.viewportTransform[5]) / zoom;
  // };
  useEffect(() => {
    if (canvasRef.current) {
      toolRef.current = currentTool;
      canvasRef.current.isDrawingMode = false;
      let drawObjects = canvasRef.current.getObjects();
      if (drawObjects.length > 0) {
        drawObjects.map((item: any) => {
          item.set('selectable', false);
        });
      }
      if (toolRef.current === tools.pen) {
        initPen();
      } else if (toolRef.current === tools.eraser) {
        initEraser();
      }
    }
  }, [currentTool]);
  useEffect(() => {
    console.log(strokeColor, 'strokeColor');
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);

  const addCanvasListner = () => {
    const mcanvas = canvasRef.current;
    mcanvas.on({
      'mouse:down': (options: any) => {
        let toolTypes = ['line', 'rect', 'circle', 'text', 'move'];
        if (toolRef.current !== tools.pen && textObject.current) {
          textObject.current.exitEditing();
          textObject.current.set('backgroundColor', 'rgba(0,0,0,0)');
          if (textObject.current.text == '') {
            canvasRef.current.remove(textObject.current);
          }
          mcanvas.renderAll();
          textObject.current = null;
        }
        if (toolTypes.indexOf(toolRef.current) != -1) {
          mouseFrom.current.x = options.pointer.x;
          mouseFrom.current.y = options.pointer.y;
          // 判断当前选择的工具是否为文本
          if (toolRef.current === tools.text) {
            // 文本工具初始化
            initText();
          } else {
            // setIsDrawingMode(true);
            isDrawingMode.current = true;
          }
        }
        // setIsDrawingMode(true);

        // if (currentTool === 'text') {
        //   drawText();
        // }
      },
      'mouse:up': (o: oProps) => {
        // mouseTo.current.x = o.pointer.x;
        // mouseTo.current.y = o.pointer.y;
        drawingObject.current = null;
        setMoveCount(1);
        isDrawingMode.current = false;
        // setIsDrawingMode(false);
        // updateModifications(true);
      },
      'mouse:move': (o: oProps) => {
        const {
          e: { shiftKey },
          pointer,
        } = o;
        if (!isDrawingMode.current) {
          //减少绘制频率
          return;
        }
        setMoveCount(moveCount + 1);
        mouseTo.current.x = pointer.x;
        mouseTo.current.y = pointer.y;
        if (isDrawingMode.current) {
          switch (toolRef.current) {
            case tools.line:
              // 当前绘制直线，初始化直线绘制
              initLine();
              break;
            case tools.rect:
              // 初始化 矩形绘制
              initRect();
              break;
            case tools.circle:
              // 初始化 绘制圆形
              shiftKey ? initCircle() : initEllipse();
              break;
            case tools.move:
              // 初始化画布移动
              initMove();
          }
        }
      },
    });
  };
  const initCanvas = () => {
    canvasRef.current = new fabric.Canvas('mycanvas', {
      isDrawingMode: true,
      selectable: false,
      selection: false,
      devicePixelRatio: true, //Retina 高清屏 屏幕支持
    });
    addCanvasListner();
  };
  useEffect(() => {
    initCanvas();
  }, []);
  return (
    <div className={styles.container}>
      <canvas id="mycanvas" width={600} height={800}></canvas>
    </div>
  );
};
export default Whiteboard;
