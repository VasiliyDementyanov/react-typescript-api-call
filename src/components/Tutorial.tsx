import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAxiosFetch } from "../custom-hooks/useAxiosFetch";

import TutorialDataService from "../services/TutorialService";
import ITutorialData from "../types/Tutorial";

const Tutorial: React.FC = () => {
  const { id }= useParams();
  let navigate = useNavigate();

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentTutorial, setCurrentTutorial] = useState<ITutorialData>(initialTutorialState);
  const [message, setMessage] = useState<string>("");

  const [ data, error, loading ] = useAxiosFetch({
    method: "GET",
    url: "/tutorials/" + id,
  });

  useEffect(() => {
    if (data) {
      setCurrentTutorial(data);
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log("getting tutorial...");
    }
  }, [loading]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updatePublished = (status: boolean) => {
    var data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status
    };

    TutorialDataService.update(currentTutorial.id, data)
      .then((response: any) => {
        console.log(response.data);
        setCurrentTutorial({ ...currentTutorial, published: status });
        setMessage("The status was updated successfully!");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const updateTutorial = () => {
    TutorialDataService.update(currentTutorial.id, currentTutorial)
      .then((response: any) => {
        console.log(response.data);
        setMessage("The tutorial was updated successfully!");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const deleteTutorial = () => {
    TutorialDataService.remove(currentTutorial.id)
      .then((response: any) => {
        console.log(response.data);
        navigate("/tutorials");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          { loading && <p>loading...</p>}
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentTutorial.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={deleteTutorial}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateTutorial}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
