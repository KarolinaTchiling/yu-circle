
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const MarketplaceComp: React.FC = () => {
    const [value, setValue] = React.useState(2);


  return (
    <div className="flex flex-col h-full w-full bg-light-green border b-black rounded-lg p-6">

        {/* Header */}
        <div className="flex flex-row items-start justify-between">
            <div className="text-3xl">
                Math 1090 Lecture Notes 
            </div>

            <div className="text-dark-teal">
                <p>Sabrina_the_runner</p>
            </div>

        </div>

        {/* Description */}
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        </div>

        {/* Tags*/}
        <div className="flex flex-row justify-between pt-2">
            <div>
                <div className="text-lg font-semibold py-1 px-10 bg-purple border border-black text-black rounded-2xl">
                    Free
                </div>
            </div>

            <div className="flex flex-row gap-3">
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    5.0 ★
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    Lecture Notes
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    Math
                </div>
            </div>
        </div>

        {/* Buttons*/}
        <div className="flex flex-row items-end justify-between pt-3">
                <button
                    className="font-fancy text-2xl cursor-pointer px-20 py-1 bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
                >
                    Download
                </button>

            <div className="flex flex-row gap-3">
                <p className="text-lg">Rate It!</p>
                <Box sx={{ '& > legend': { mt: 3 } }}>
                    <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                        setValue(newValue);
                        }}
                    />           
                </Box>
            </div>

        </div>

    </div>
  )
}

export default MarketplaceComp;

