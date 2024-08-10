import { DragDropContext } from 'react-beautiful-dnd';
import PreviewArea from './components/PreviewArea'
import { createContext, useState } from 'react';
import Playground from './components/Playground';

export const GlobalContext = createContext();

function App() {
  const [data, setData] = useState({})
  return (
    <>
        <GlobalContext.Provider value={{ data, setData }}>
        <DragDropContext onDragEnd={()=>{}}>
          <div className="bg-neutral-600 font-sans">
            <div className="h-screen overflow-hidden flex flex-row  ">
              <div className="flex-1 h-screen overflow-hidden flex flex-row bg-neutral-800	 border-t border-r border-neutral-600 rounded-tr-xl ">
                <Playground />
              </div>
              <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-neutral-700	 border-t border-l border-neutral-600 rounded-tl-xl ml-2">
                <PreviewArea />
              </div>
            </div>
          </div>
          </DragDropContext>
        </GlobalContext.Provider>
    </>
  )
}

export default App
