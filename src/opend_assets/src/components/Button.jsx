import React from "react";

function Button(props) /* This Component will display button based on the user action like whether
                         User is buying the NFT or Selling the NFT and the text of the button based
                         on the props that the button component sends it here. */
{
    return(<div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
        <span
          onClick={props.handleClick}
          className="form-Chip-label"
        >
          {props.text}
        </span>
        </div>);
}

export default Button;