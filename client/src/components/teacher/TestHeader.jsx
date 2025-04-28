import React from 'react';

export default function TestHeader({ test, handlePublish }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">{test.title}</h1>
            <div className="flex gap-2">
                {test.status === 'draft' && (
                    <button
                        onClick={handlePublish}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Publish Test
                    </button>
                )}
            </div>
        </div>
    );
}