import React, { useState } from 'react';
import Whiteboard from '@/components/Whiteboard';
import { tools } from '@/components/Whiteboard/types';
import { toolList } from './data';
import styles from './index.less';
import { SketchPicker } from 'react-color';

const index: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<tools>(tools.pen);
  const [strokeColor, setStrokeColor] = useState<string>('#000');
  const ToolBar: React.FC = () => {
    const handleStrokeColorChange = (ncolor: any) => {
      // debugger;
      const { hex } = ncolor;
      setStrokeColor(hex);
    };
    return (
      <div className={styles.toolbar}>
        {Object.values(toolList).map((item) => {
          return (
            <div
              className={styles.tool}
              key={item.name}
              onClick={() => setCurrentTool(item.name)}
            >
              {item.label}
            </div>
          );
        })}
        <div>
          <div className={styles.colorDisplay}>
            <div
              className={styles.colorPicker}
              style={{ backgroundColor: strokeColor }}
            ></div>
            {strokeColor}
          </div>
          <SketchPicker
            color={strokeColor}
            onChange={handleStrokeColorChange}
          />
        </div>
      </div>
    );
  };
  // useEffect(() => {
  //   console.log(currentTool, 'change');
  // }, [currentTool]);
  return (
    <>
      <ToolBar />
      <Whiteboard
        currentTool={currentTool}
        strokeColor={strokeColor}
        fillColor={'#fff'}
      ></Whiteboard>
    </>
  );
};
export default index;
