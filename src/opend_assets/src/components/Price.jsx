import React, { useState } from "react";

function Price(props){
    console.log("Price Component:"+ props.sellprice);
return(
<div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
          <span className="disChip-label">{Number(props.sellprice)} DANG</span>
        </div>);
}

export default Price;