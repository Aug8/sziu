import { useState } from "react";

function Basic() {
  const [roll, setRoll] = useState(0);
  const [c1, setC1] = useState({
    stat: "str",
    value: 1,
  });
  const [result, setResult] = useState("");

  const stats = {
    str: [0, 20, 35, 50, 65, 80],
    bat: [0, 30, 40, 50, 60, 70],
    agi: [0, 60, 70, 80, 85, 90],
    sec: [0, 20, 35, 50, 65, 80],
  };

  const onChangeStat = (e) => {
    setC1((prevState) => {
      return { ...prevState, stat: e.target.value };
    });
  };

  const onChangeValue = (e) => {
    setC1((prevState) => {
      return { ...prevState, value: e.target.value };
    });
  };

  const onClickBattle = (e) => {
    const newRoll = Math.floor(Math.random() * (100 - 1) + 1);

    let newResult;
    if (newRoll <= stats[c1.stat][c1.value]) {
      newResult = "성공";
    } else {
      newResult = "실패";
    }

    setRoll(newRoll);
    setResult(newResult);
  };

  return (
    <div className="battle-area">
      <h3>일반 판정</h3>

      <select className="battle-select" onChange={onChangeStat}>
        <option value="str">근력</option>
        <option value="bat">전투</option>
        <option value="agi">민첩</option>
        <option value="sec">은밀</option>
      </select>

      <select className="battle-select" onChange={onChangeValue}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>

      <button onClick={onClickBattle}>결과</button>

      <div className="result">
        [{roll}] {c1.name}
        {result}
      </div>
    </div>
  );
}

export default Basic;
