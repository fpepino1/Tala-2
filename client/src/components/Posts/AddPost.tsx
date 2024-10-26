import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { FaImage } from 'react-icons/fa'; 
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
import { handleReload } from '../../utils/HandleReload';
import api from '../../utils/api';

const AddPost = () => {
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize function for the textarea
  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const userData = getUserData();
    console.log('Fetched user data:', userData); 
    if (!userData) {
      handleReload();
    } else {
      setUser(userData);
    }
  }, []);

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!description) {
      alert('Please add a description.');
      return;
    }
  
    try {
      const formData = new FormData();
           
      formData.append('description', description);
      formData.append('postedBy', user?.userId || '');

      const response = await api.post('/post/createPost', 
        formData      );
  
      if (response.status === 201) {
        setDescription(''); 
        handleReload();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <div className="mt-10">
      <form onSubmit={handlePostSubmit} className="flex flex-col space-y-2">
        <div className="relative w-full mt-2">
          <textarea
            ref={textareaRef}
            className="p-3 w-full mt-1 bg-white bg-opacity-10 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none overflow-hidden text-white placeholder-gray-400"
            rows={3}
            placeholder={`What's on your mind, ${user?.firstName}?`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onInput={autoResize}
          />

          <div className="absolute bottom-4 right-2 flex space-x-2">
            {/* Image Upload Button (Disabled) */}
            <label className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer">
              <FaImage size={18} />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => console.log('Image upload disabled')} // Disabled for now
              />
            </label>

            <button
              type="submit"
              className={`px-4 py-1 rounded-full text-white hover:bg-gray-800 ${
                description ? 'bg-gray-700' : 'bg-gray-500 cursor-not-allowed'
              }`}
              disabled={!description}
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
