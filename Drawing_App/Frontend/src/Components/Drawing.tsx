import React, { useState, useRef} from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Header from './Header';
import { useAppSelector } from '../Redux/Hooks';
import { useGetDrawingQuery } from '../Redux/Slices/Api';
import Rectangle from './Rectangle';


interface DrawingProps {
  datalines: any;
}


const Drawing: React.FC<DrawingProps>  = ({ datalines }) => {
  
  
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef<boolean>(false);
  
  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };
  
  
  
  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };
  
  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  
  
  console.log('Lines:', lines);
  
  const storeid = useAppSelector(state=>state.myid)
  
  const {data} = useGetDrawingQuery(storeid);
  if(!datalines) datalines = data;
  
  
  return (
    <div>
      <Header lines = {lines}  />  
      <h1>Drawing ID - {storeid}</h1>
{ (tool == 'rectangle') ? <Rectangle/>  :   <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        

        {
          datalines &&         
          <Layer>
          {datalines.drawingData.map((line:any, i:any) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
        }

        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>}
      
      <select 
        className="fixed top-0 left-0"
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
        <option value="rectangle">Rectangle</option>
        
      </select>
    </div>
  );
};
;

export default Drawing;