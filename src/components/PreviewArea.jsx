import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import CatSprite from './CatSprite';
import Draggable from 'react-draggable';
import { Flag, Github, RotateCcw, Undo2Icon } from 'lucide-react';
import { GlobalContext } from '../App';
import { throttle } from 'lodash';

export default function PreviewArea() {
  const { data } = useContext(GlobalContext);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [animation, setAnimation] = useState(null);
  const [text, setText] = useState({ message: '', duration: 0, animation: false });
  const [size, setSize] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const pointTowardsMouse = () => {
    const rect = document.getElementById("sprite").getBoundingClientRect();
    const svgCenterX = rect.left + rect.width / 2;
    const svgCenterY = rect.top + rect.height / 2;

    const deltaX = mousePositionRef.current.x - svgCenterX;
    const deltaY = mousePositionRef.current.y - svgCenterY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  };

  const filterByEventType = (data, event_type) => {
    return data.filter(item =>
      item.items.some(action => action.type === event_type)
    );
  };

  const startAnimation = useCallback((event_type = 'flag_clicked') => {
    let _data = data.groups;
    if (_data && _data.length > 0) {
      const actions = filterByEventType(_data, event_type);
      console.log(actions)
      if (actions.length > 0) {
        setHistory(prev => [...prev, { position, rotation, size, text }]);
        actions.forEach(action => executeAction(action.items, 1));
      }
    }
  }, [data, position, rotation, size, text, animation]);

  const executeAction = (action_list, index) => {
    console.log(action_list)
    const { type, initialValue } = action_list[index];
    setPlaying(true);
    switch (type) {
      case 'move':
        setPosition({ x: initialValue.x});
        break;
      case 'go_to':
        setPosition({ x: initialValue.x, y: initialValue.y });
        break;
      case 'random':
        setPosition({ x: Math.random() * 400, y: Math.random() * 400 });
        break;
      case 'clockwise':
        setRotation(rotation + initialValue.rotation);
        break;
      case 'anticlockwise':
        setRotation(rotation - initialValue.rotation);
        break;
      case 'glide':
        setAnimation({ type: 'glide', duration: initialValue.delay * 1000 });
        setPosition({ x: initialValue.x, y: initialValue.y });
        setTimeout(() => { setAnimation(null) }, initialValue.delay * 1000)
        break;
      case 'glide_random':
        setAnimation({ type: 'glide', duration: initialValue.delay * 1000 });
        setPosition({ x: Math.random() * 400, y: Math.random() * 400 });
        setTimeout(() => { setAnimation(null) }, initialValue.seconds * 1000)
        break;
      case 'point_in_direction':
        setRotation(initialValue.direction);
        break;
      case 'mouse_pointer':
        if (initialValue.target === 'MOUSE_POINTER') {
          setRotation(pointTowardsMouse());
          setAnimation(null);
        }
        break;
      case 'change_x_by':
        setPosition(prev => ({ ...prev, x: prev.x + initialValue.x }));
        break;
      case 'set_x':
        setPosition(prev => ({ ...prev, x: initialValue.x }));
        break;
      case 'change_y_by':
        setPosition(prev => ({ ...prev, y: prev.y + initialValue.y }));
        break;
      case 'set_y':
        setPosition(prev => ({ ...prev, y: initialValue.y }));
        break;
      case 'say_for_seconds':
        setText({ message: initialValue.message, duration: initialValue.delay * 1000, animation: false });
        setTimeout(() => setText({ message: '', duration: 0, animation: false }), initialValue.delay * 1000);
        break;
      case 'say':
        setText({ message: initialValue.message, duration: 100, animation: false });
        break;
      case 'think_for_seconds':
        setText({ message: initialValue.message, duration: initialValue.delay * 1000, animation: true });
        setTimeout(() => setText({ message: '', duration: 0, animation: false }), initialValue.delay * 1000);
        break;
      case 'think':
        setText({ message: initialValue.message, duration: 100, animation: true });
        break;
      case 'change_size':
        setSize(size + initialValue.size);
        break;
      default:
        break;
    }

    if (action_list && index < action_list.length - 1) {
      setTimeout(() => executeAction(action_list, index +1), 10);
    } else {
      setPlaying(false);
    }
  };

  const undoAction = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setPosition(lastState.position);
      setRotation(lastState.rotation);
      setSize(lastState.size);
      setText(lastState.text);
      setHistory(history.slice(0, -1));
    }
  };



  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setSize(0);
    setText({ message: '', duration: 0, animation: false });
    setHistory([]);
    setPlaying(false);
    setAnimation(null);
  };

  // const stop = () => { // This logic is not working as expected
  //   setPlaying(false);
  //   setAnimation(null);
  // };




  useEffect(() => {
    const handleMouseMove = throttle((event) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    }, 200);

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        startAnimation("space_clicked");
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startAnimation]);

  return (
    <div className="flex-none w-full">
      <div className="flex flex-row p-4 gap-4 justify-end pr-6 z-10">
        {history.length > 0 && (
          <div
            onClick={undoAction}
            title='Undo'
            className='cursor-pointer self-center flex flex-row gap-1'
          >
            <p className='font-semibold'>{history.length}</p >
            <Undo2Icon />
          </div>
        )}
        <div
          onClick={() => startAnimation("flag_clicked")}
          title={"Run"}
          className={`cursor-pointer self-center ${playing ? "pointer-events-none" : ""}`}
        >

          <Flag fill={playing ? "gray" : "#00ff11"} color='#00ff11' />
        </div>

        <div
          onClick={reset}
          title='Reset'
          className='cursor-pointer self-center'
        >
          <RotateCcw color='white' />
        </div>
        <div
          onClick={() => window.open("https://github.com/ksanjeeb/MIT-Scratch-Blockly", "_blank")}
          title='Get the code! - github.com/ksanjeeb'
          className='cursor-pointer ml-1 bg-gray-200 rounded-xl p-1'
        >
          <Github />
        </div>

      </div>
      <Draggable className="h-[calc(100vh_-_4rem)] overflow-y-auto p-2 relative border">
        <div
          className="relative"
          style={{
            left: position.x,
            top: position.y,
            transition: animation ? `${animation.duration || 0}ms` : 'none',
          }}
          onClick={() => startAnimation("sprite_clicked")}
        >
          <CatSprite
            style={{ transform: `rotate(${rotation}deg)` }}
            size={size}
            tooltipText={text.message}
            showTooltip={text.duration > 0}
            animation={text?.animation}
          />
        </div>
      </Draggable>
    </div>
  );
}
