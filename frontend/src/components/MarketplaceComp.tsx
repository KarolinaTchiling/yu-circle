
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface MarketplaceProps {
    title: string;
    user: string;
    description: string;
    rating: number;
    contentType: string;
    program: string;
  }

  const MarketplaceComp: React.FC<MarketplaceProps> = ({
    title,
    user,
    description,
    rating,
    contentType,
    program
  }) => {
    const [value, setValue] = React.useState(2);


  return (
    <div className="flex flex-col h-full w-full bg-light-green border b-black rounded-lg p-6">

        {/* Header */}
        <div className="flex flex-row items-start justify-between">
            <div className="text-3xl">
                {title}
            </div>

            <div className="text-dark-teal">
                <p>{user}</p>
            </div>

        </div>

        {/* Description */}
        <div>
            {description}
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
                    {rating.toFixed(1)} ★
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    {contentType}
                </div>
                <div className="text-lg py-1 px-5 bg-offwhite border border-black text-black rounded-lg">
                    {program}
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

