import { PackagePlus } from "lucide-react";

function Playground(props) {
    return (
        <div className="p-4 w-full">
            <div className="flex flex-row justify-between mr-4">
            <div className='h-12 w-28 flex items-center self-center'>
                <img src='/scratch.png' alt="Scratch Logo" className='h-full w-full object-contain' />
            </div>
            <div className="self-center cursor-pointer border-1 rounded-md p-1 text-white flex flex-row gap-2 border-white">
                Add Group
            <PackagePlus color="white"   />

            </div>
            </div>

        </div>
    );
}

export default Playground;