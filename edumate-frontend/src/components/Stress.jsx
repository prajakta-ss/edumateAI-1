import { useState } from "react";

export default function Stress() {

const questions = [
"1. I feel overwhelmed by my academic workload.",
"2. I have difficulty concentrating on studies.",
"3. I feel nervous before exams.",
"4. I feel mentally exhausted after studying.",
"5. I feel pressure to achieve high grades.",
"6. I struggle to manage my study time.",
"7. I feel anxious about my academic future.",

"8. Do you feel stressed daily?",
"9. Do you have trouble sleeping?",
"10. Do you feel physically tired often?",
"11. Do you feel difficulty relaxing?",
"12. Do you experience headaches due to stress?",
"13. Do you feel distracted easily?",
"14. Do you feel irritated frequently?",
"15. Do you feel emotionally drained?",

"16. I feel confident about handling academic challenges.",
"17. I feel supported by friends or family.",
"18. I feel capable of managing stress effectively.",
"19. I feel satisfied with my academic performance.",
"20. I feel positive about my studies."
];


// Q1–Q7
const likertScale = [
{ label: "Strongly Disagree", value: 1 },
{ label: "Disagree", value: 2 },
{ label: "Neutral", value: 3 },
{ label: "Agree", value: 4 },
{ label: "Strongly Agree", value: 5 }
];

// Q8–Q15
const yesNoMaybe = [
{ label: "Yes", value: 1 },
{ label: "No", value: 0 },
{ label: "Maybe", value: 2 }
];

// Q16–Q20
const agreementScale = [
{ label: "Strongly Disagree", value: 1 },
{ label: "Disagree", value: 2 },
{ label: "Neutral", value: 3 },
{ label: "Agree", value: 4 },
{ label: "Strongly Agree", value: 5 }
];


const getOptions = (index) => {

if(index <= 6){
return likertScale;
}

if(index >=7 && index <=14){
return yesNoMaybe;
}

return agreementScale;

};


const [answers,setAnswers] = useState(Array(20).fill(""));
const [result,setResult] = useState("");
const [loading,setLoading] = useState(false);


const handleChange = (index,value) => {

const updated = [...answers];
updated[index] = Number(value);
setAnswers(updated);

};


const handleSubmit = async () => {

if(answers.includes("")){
alert("Please answer all questions");
return;
}

try{

setLoading(true);

const response = await fetch(
"http://localhost:5000/api/stress/predict",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({answers})
}
);

const data = await response.json();

setResult(data.stress_level);

}catch(error){

console.error(error);
alert("Server error. Please try again.");

}

setLoading(false);

};



return (

<div className="max-w-3xl">

<h1 className="text-2xl font-bold mb-6 text-indigo-600">
Stress Analysis
</h1>

<div className="space-y-5">

{questions.map((q,index)=>{

const options = getOptions(index);

return(

<div key={index} className="bg-white p-4 rounded-lg shadow">

<p className="font-medium mb-2">
{q}
</p>

<select
className="border p-2 rounded w-full"
value={answers[index]}
onChange={(e)=>handleChange(index,e.target.value)}
>

<option value="">
Select Option
</option>

{options.map(opt=>(
<option key={opt.value} value={opt.value}>
{opt.label}
</option>
))}

</select>

</div>

)

})}

<button
onClick={handleSubmit}
className="mt-6 w-full text-indigo-600 py-2 rounded-lg 
          hover:bg-indigo-700 transition duration-200 font-medium"
>

{loading ? "Analyzing..." : "Analyze Stress"}

</button>


{result && (

<div className="mt-6 p-4 bg-indigo-100 rounded-lg">

<h2 className="text-xl font-semibold">

Predicted Stress Level: {result}

</h2>

</div>

)}

</div>

</div>

);

}