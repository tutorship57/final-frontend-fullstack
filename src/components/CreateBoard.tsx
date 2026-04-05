import React, { useState } from "react";
import { apiFetch } from "./utils/api";
import { useAuth } from "../contexts/type";

interface CreateBoardProps {
  workspaceId: string;
  onBoardCreated?: () => void; // Optional callback to refresh your board list
}

const CreateBoard = ({ workspaceId, onBoardCreated }: CreateBoardProps) => {
  const { user } = useAuth();
  
  // --- Form State matching your Board Entity ---
  const [title, setTitle] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // --- Handlers ---
  const handleCreateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("from CreateBoard: ",workspaceId)
    console.log("from CreateBoard: ",title, ", " , backgroundUrl)
    if (!title.trim() || !user?.userId) return;
    
    setIsCreating(true);
    try {
      // Adjust this URL to match your actual backend route
      const res = await apiFetch(`/users/${user.userId}/workspace/${workspaceId}/boards`, {
        method: 'POST',
        headers: {  
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: title, 
          background_url: backgroundUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop",
          workspace_id: workspaceId
        }),
      });
      console.log(res)
      if (res.ok) {
        
        setTitle("");
        setBackgroundUrl("");
        alert("Board created successfully!");
        if (onBoardCreated) onBoardCreated();
      } else {
        const errorData = await res.json();
        console.log(res)
        console.error("Validation Error:", errorData);
        alert(`Failed to create board: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- CREATE BOARD SECTION --- */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Create New Board</h2>
        
        <form onSubmit={handleCreateBoard} className="space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Board Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Marketing Roadmap, Bug Tracker..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>

          {/* Background URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Background Image URL <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="url"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {/* Little visual preview if they type a URL */}
              {backgroundUrl && (
                <div 
                  className="w-10 h-10 rounded-lg bg-cover bg-center border border-gray-600 flex-shrink-0"
                  style={{ backgroundImage: `url(${backgroundUrl})` }}
                  title="Background Preview"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Board"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateBoard;