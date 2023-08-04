import React, { useEffect, useState } from "react";

import { Link, useLocation, useParams , useNavigate} from "react-router-dom";

import axios from 'axios';




function LookerData() { 

  return (
<>   <div className="container">

<iframe width="600" height="450" src="https://lookerstudio.google.com/embed/reporting/78065827-b5ff-4da0-8a39-c7819e4fcd6b/page/HdgYD" frameborder="0" style= {{border:0}} allowfullscreen></iframe>
</div>
<div className="container">
<iframe width="600" height="450" src="https://lookerstudio.google.com/embed/reporting/8723966c-41bf-4a65-8c08-d6a8532d803d/page/D7gYD" frameborder="0" style={{ border:0}} allowfullscreen></iframe>
</div>
<div className="container">
<iframe width="600" height="450" src="https://lookerstudio.google.com/embed/reporting/64d908d5-8977-4e41-a542-b6c9066b7cd2/page/v2gYD" frameborder="0" style= {{border:0}} allowfullscreen></iframe>

    </div>
    </>
 

  );

}




export default LookerData;


