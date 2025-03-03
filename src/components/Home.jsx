import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utilis/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "./TravelStoryCard";
import { ToastContainer, toast } from 'react-toastify';
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "./EmptyCard";

import { getEmptyCardImg, getEmptyCardMessage } from "../utilis/helper";

function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("No access token found. Please log in.");
      return;
    }
    try {
      const response = await axiosInstance.get("/get-user", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      handleErrorResponse(error, navigate);
    }
  };

  const getAllTravelStories = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("No access token found. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-story", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const addNewTravelStory = async (storyData) => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("No access token found. Please log in.");
      return;
    }
    try {
      const response = await axiosInstance.post("/add-travel-story", storyData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllTravelStories(); // Refresh stories after adding a new one
      } else {
        console.error("Unexpected response structure:", response);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        toast.error(error.response.data.message || "An unexpected error occurred. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleErrorResponse = (error, navigate) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/dashboard");
      } else {
        console.log("Error:", error.response.data.message);
      }
    } else if (error.request) {
      console.log("Network error, please try again later.");
    } else {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("No access token found. Please log in.");
      return;
    }
  
    const updatedStory = { ...storyData, isFavourite: !storyData.isFavourite };
    setAllStories((prevStories) =>
      prevStories.map((story) =>
        story._id === storyId ? updatedStory : story
      )
    );
  
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavourite: updatedStory.isFavourite,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
  
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // If the update was successful, no further action is needed
      } else {
        toast.error("Failed to update favorite status.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      // Revert the optimistic update if there's an error
      setAllStories((prevStories) =>
        prevStories.map((story) =>
          story._id === storyId ? storyData : story // revert back to the original state
        )
      );
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("No access token found. Please log in.");
      return;
    }
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Try again later.");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Try again later.");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory} // Pass the function here
        handleClearSearch={handleClearSearch}
      />
      
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {loading ? (
              <p>Loading stories...</p>
            ) : allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={Boolean(item.isFavourite)}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard 
                imgSrc={getEmptyCardImg(filterType)} 
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => setOpenAddEditModel({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModel.data}
          type={openAddEditModel.type}
          onClose={() => setOpenAddEditModel({ isShown: false, type: "add", data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory 
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
}

export default Home;
