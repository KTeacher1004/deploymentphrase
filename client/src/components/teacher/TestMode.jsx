import React from 'react';

export default function TestMode({ test, handleModeChange, copyTestId, copied, id }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Mode</h2>
            <div className="flex gap-4">
                <button
                    onClick={() => handleModeChange('public')}
                    className={`px-4 py-2 rounded-md ${
                        test.mode === 'public' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Public
                </button>
                <button
                    onClick={() => handleModeChange('assigned')}
                    className={`px-4 py-2 rounded-md ${
                        test.mode === 'assigned' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Assigned
                </button>
                <button
                    onClick={() => handleModeChange('private')}
                    className={`px-4 py-2 rounded-md ${
                        test.mode === 'private' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Private
                </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
                {test.mode === 'public' && "All students can access this test"}
                {test.mode === 'assigned' && "Only assigned students can access this test"}
                {test.mode === 'private' && "This test is private and not accessible to students"}
            </p>

            {test.mode === 'private' && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-semibold mb-2">Test Access Code</h3>
                    <div className="flex items-center gap-2">
                        <code className="p-2 bg-white rounded border flex-1">{id}</code>
                        <button
                            onClick={copyTestId}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Share this code with students to allow them to access this test.
                    </p>
                </div>
            )}
        </div>
    );
}