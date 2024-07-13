import React, { useEffect, useState } from "react";
import "./recipe.scss";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../config.js";

const Recipe = ({ edit, add, view }) => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    steps: [],
  });
  const [image, setImage] = useState(null);
  const [modal, setModal] = useState(false);

  const handleRecipe = async () => {
    await fetch(BASE_URL + "/" + id, {
      cache: "no-store",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setForm(data);
        setImage(data.image);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = async () => {
    await fetch(BASE_URL + "/" + id, {
      cache: "no-store",
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
    navigate("/");
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (image) formData.append("image", image);

    for (const key in form) {
      if (key === "steps") {
        formData.append("steps", JSON.stringify(form[key]));
        continue;
      } else if (key === "image") {
        continue;
      }
      formData.append(key, form[key]);
    }
    const url = edit ? `${BASE_URL}/${id}` : BASE_URL;
    await fetch(url, {
      cache: "no-store",
      method: edit ? "PATCH" : "POST",
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));

    goBack();
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...form?.steps];
    newSteps[index] = value;
    setForm({ ...form, steps: [...newSteps] });
  };

  const handleAddStep = () => {
    setForm({ ...form, steps: [...form?.steps, ""] });
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...form?.steps];

    newSteps.splice(index, 1);
    setForm({ ...form, steps: [...newSteps] });
  };

  useEffect(() => {
    if (view || edit) {
      handleRecipe();
    }
  }, []);

  const goBack = () => {
    if (add || view) {
      navigate("/");
    } else {
      navigate("/recipe/" + id);
    }
  };

  return (
    <div className="recipe-container">
      <div className="recipe-form">
        <div className="title">
          <div className="nav-left">
            <span onClick={goBack}>{"<- "}</span>
            {add
              ? "Create Recipe"
              : edit
              ? `Edit Recipe #${id}`
              : `Recipe #${id}`}
          </div>
          <div className="button-container">
            {view && <button onClick={() => navigate("edit")}>Edit</button>}
            {!add && <button onClick={() => setModal(true)}>Delete</button>}
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="title">Title: </label>
          <input
            disabled={view}
            name="title"
            type="text"
            placeholder="Enter title"
            value={form?.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="input-container">
          <label htmlFor="ingredients">Ingredients: </label>
          <textarea
            disabled={view}
            spellCheck="false"
            name="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={form?.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          />
        </div>
        <div className="Image">
          <label htmlFor="image">Image: </label>
          {view && image && (
            <div className="uploaded-container">
              <img
                className="uploadedimg"
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="uploaded image"
              />
            </div>
          )}
          {!view && (
            <div className="upload">
              {image && (
                <div className="uploaded-container">
                  <img
                    onClick={() => setImage(null)}
                    className="uploadedimg"
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt="uploaded image"
                  />
                </div>
              )}
              <button>
                <label
                  style={{
                    cursor: "pointer",
                  }}
                  htmlFor="img"
                >
                  Upload Image
                </label>
              </button>
              <input
                hidden
                type="file"
                name="image"
                id="img"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setImage(e.target.files[0])}
              />
              Accepts png, jpeg and webp.
            </div>
          )}
        </div>
        <div className="step-inputs">
          <label htmlFor="step">Steps: </label>
          {form?.steps.map((_, index) => (
            <div className="input-container step" key={index}>
              <label htmlFor="step">{index + 1}: </label>
              <input
                disabled={view}
                className="step-input"
                type="text"
                name="step"
                placeholder={`Step ${index + 1}`}
                value={form?.steps[index]}
                onChange={(e) => handleStepChange(index, e.target.value)}
              />
              {!view && (
                <button
                  className="remove-step"
                  onClick={() => handleRemoveStep(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="18"
                    viewBox="0 0 14 18"
                    fill="none"
                  >
                    <path
                      d="M1 16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H11C11.5304 18 12.0391 17.7893 12.4142 17.4142C12.7893 17.0391 13 16.5304 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z"
                      fill="black"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {!view && (
            <button className="add-step" onClick={handleAddStep}>
              Add Step
            </button>
          )}
        </div>
        {!view && <button onClick={handleSave}>Save</button>}
      </div>
      {modal && (
        <div className="modal">
          <div className="modal-container">
            Are you sure you want to delete this recipe?
            <div className="modal-buttons">
              <button onClick={() => setModal(false)}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
