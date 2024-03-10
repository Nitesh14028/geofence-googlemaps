export const initializeButtons = (buttonList, map, google) => {
  const centerControlDiv = document.createElement("div");
  centerControlDiv.style.display = "flex";
  centerControlDiv.style.flexDirection = "row";
  centerControlDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  centerControlDiv.style.borderRadius = "3px";
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
    centerControlDiv
  );

  buttonList.forEach((button) => {
    const { label, onClick } = button;
    // Set CSS for the control border.
    let controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = `2px solid #747474`;
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = label;
    centerControlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    let controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Poppins";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.style.width = "80px";
    controlText.innerHTML = label;
    controlUI.appendChild(controlText);

    //to delete the polygon
    controlUI.addEventListener("click", function () {
      onClick();
    });
  });
};
