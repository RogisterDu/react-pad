interface whiteboardProps {
  currentTool: tools;
  strokeColor: string;
  fillColor: string;
}
interface mouseProps {
  x: number;
  y: number;
}
interface oProps {
  pointer: mouseProps;
  e: any;
}

enum tools {
  text = 'text',
  pen = 'pen',
  line = 'line',
  rect = 'rect',
  circle = 'circle',
  eraser = 'eraser',
  move = 'move',
}

export { whiteboardProps, mouseProps, tools, oProps };
