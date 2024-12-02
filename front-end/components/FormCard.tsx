import { formCardProps } from "next-auth";
import React from "react";
async function FormCard(props :formCardProps) {
     return(<>
     <div className=" flex flex-col rounded-xl drop-shadow-lg overflow-hidden ">
          <div className="bg-custom1 h-2/3">
          </div>
          <div className="h-1/3">
          <p>{props.title}</p>
          <p>{`${props.date.getFullYear}/${props.date.getMonth}/${props.date.getDay}`}</p>
          </div>
     </div>
     </>)
}
export default FormCard ;