import { useState } from "react";
import "./battle.css";

function Battle() {
  const [character, setCharacter] = useState([]);
  const [newCharacter, setNewCharacter] = useState("");
  const [aggro, setAggro] = useState([]);
  const [newAggro, setNewAggro] = useState([]);
  const [action, setAction] = useState([]);
  const [zombie, setZombie] = useState(0);
  const [avoid, setAvoid] = useState([]);
  const [avoidV, setAvoidV] = useState([]);
  const [result, setResult] = useState("");
  const [resultZ, setResultZ] = useState("");
  const [resultA, setResultA] = useState("");
  const [resultH, setResultH] = useState("");

  const stats = {
    str: [0, 20, 35, 50, 65, 80],
    bat: [0, 30, 40, 50, 60, 70],
    agi: [0, 60, 70, 80, 85, 90],
    sec: [0, 20, 35, 50, 65, 80],
  };

  const onChangeStat = (e, index) => {
    setAction((prevState) => {
      const updatedAction = [...prevState];
      updatedAction[index].stat = e.target.value;
      return updatedAction;
    });
  };

  const onChangeValue = (e, index) => {
    setAction((prevState) => {
      const updatedAction = [...prevState];
      updatedAction[index].value = e.target.value;
      return updatedAction;
    });
  };

  const onChangeZombie = (e) => {
    setZombie(e.target.value);
  };

  const onKeyPressA = (e) => {
    if (e.key === "Enter") {
      addAggro();
    }
  };

  const addAggro = () => {
    if (newAggro.trim() !== "") {
      setAggro([...aggro, newAggro]);
      setNewAggro("");
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      addCharacter();
    }
  };

  const addCharacter = () => {
    if (newCharacter.trim() !== "") {
      setCharacter([...character, newCharacter]);
      setAction((prevState) => [
        ...prevState,
        { name: newCharacter, stat: "bat", value: 5 },
      ]);
      setNewCharacter("");
    }
  };

  const removeCharacter = (index) => {
    const updatedCharacter = [...character];
    updatedCharacter.splice(index, 1);
    setCharacter(updatedCharacter);

    const updatedAction = [...action];
    updatedAction.splice(index, 1);
    setAction(updatedAction);
  };

  const removeAggro = (index) => {
    const updatedAggro = [...aggro];
    updatedAggro.splice(index, 1);
    setAggro(updatedAggro);
  };

  const onClickBattle = () => {
    setResultZ("");
    setResultA("");
    setAvoid([]);
    setResult("");
    setAggro([]);

    let newResult = "";
    let kill = 0;
    let noise = [];

    for (let index = 0; index < character.length; index++) {
      const newRoll = Math.floor(Math.random() * (100 - 1) + 1);
      if (newRoll <= stats[action[index].stat][action[index].value]) {
        if (action[index].stat === "bat") {
          newResult += `[${newRoll}] ${action[index].name}(은)는 좀비를 처리했다.<br>`;
          kill += 1;
        } else if (action[index].stat === "agi") {
          newResult += `[${newRoll}] ${action[index].name}(은)는 무사히 도주했다.<br>`;
          setAction((prevAction) =>
            prevAction.filter((item) => item.name !== action[index].name)
          );
          setCharacter((prevCharacter) =>
            prevCharacter.filter((item) => item !== action[index].name)
          );
        } else if (action[index].stat === "sec") {
          newResult += `[${newRoll}] 좀비는 ${action[index].name}(을)를 무시했다.<br>`;
        }
      } else {
        if (action[index].stat === "bat") {
          newResult += `[${newRoll}] ${action[index].name}의 공격은 빗나갔다.<br>`;
        } else if (action[index].stat === "agi") {
          newResult += `[${newRoll}] ${action[index].name}(은)는 도주하지 못했다.<br>`;
        } else if (action[index].stat === "sec") {
          newResult += `[${newRoll}] ${action[index].name}(은)는 좀비의 시선을 끌었다.<br>`;
          noise.push(action[index].name);
        }
      }
    }

    setResult(newResult);
    if (zombie - kill < 0) {
      setZombie(0);
    } else {
      setZombie(zombie - kill);
    }

    setAggro((prevAggro) => [...prevAggro, ...noise]);

    console.log(action);
  };

  //좀비 공격
  const onClickZombie = (e) => {
    setAction((prevAction) =>
      prevAction.map((item) => ({ ...item, stat: "bat", value: 5 }))
    );
    const selectElements = document.querySelectorAll(".battle-select");
    selectElements.forEach((selectElement) => {
      selectElement.value = "bat";
    });
    setResultZ("");
    setAvoid([]);
    setAvoidV([]);
    setResultA("");
    let newResultZ = "";
    let hurt = [];
    let hurtV = [];

    for (let i = 0; i < aggro.length; i++) {
      newResultZ += `좀비${i + 1} > ${aggro[i]}<br>`;
      hurt.push(aggro[i]);
      hurtV.push(5);
    }
    for (let i = 0 + aggro.length; i < zombie; i++) {
      const newRoll = Math.floor(Math.random() * (character.length - 0) + 0);
      newResultZ += `좀비${i + 1} > ${character[newRoll]}<br>`;
      hurt.push(character[newRoll]);
      hurtV.push(5);
    }
    if (zombie === 0) {
      newResultZ = `남은 좀비가 없는데용?`;
    }
    setResultZ(newResultZ);
    setAvoid((prevAvoid) => [...prevAvoid, ...hurt]);
    setAvoidV((prevAvoidV) => [...prevAvoidV, ...hurtV]);
  };

  const onClickAvoid = () => {
    setResultA("");
    setResultH("");
    setAction((prevAction) =>
      prevAction.map((item) => ({ ...item, stat: "bat", value: 5 }))
    );
    const selectElements = document.querySelectorAll(".battle-select");
    selectElements.forEach((selectElement) => {
      selectElement.value = "bat";
    });

    console.log(action);
    let newResultA = "";
    let newResultH = "";
    for (let index = 0; index < avoid.length; index++) {
      const newRoll = Math.floor(Math.random() * (100 - 1) + 1);
      if (newRoll <= stats["agi"][avoidV[index]]) {
        newResultA += `[${newRoll}] ${avoid[index]} 성공<br>`;
      } else {
        newResultA += `[${newRoll}] ${avoid[index]} 실패<br>`;
        const nnewRoll = Math.floor(Math.random() * (100 - 1) + 1);
        if (nnewRoll < 35) {
          newResultA += `좀비가 달려들어 ${avoid[index]}의 손을 물었다.<br>`;
        } else if (nnewRoll < 65) {
          newResultA += `바닥을 기어온 좀비가 ${avoid[index]}의 발목을 물었다.<br>`;
        } else if (nnewRoll < 85) {
          newResultA += `좀비가 뛰어들어 ${avoid[index]}의 아래팔을 물었다.<br>`;
        } else if (nnewRoll < 95) {
          newResultA += `좀비가 넘어지며 ${avoid[index]}의 종아리를 물었다.<br>`;
        } else if (nnewRoll < 100) {
          newResultA += `좀비가 입을 크게 벌리며 ${avoid[index]}의 위팔을 물었다.<br>`;
        }
      }
    }
    setResultA(newResultA);
    // setResultH(newResultH);
  };

  const onChangeAvoidV = (e, index) => {
    setAvoidV((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = e.target.value;
      return updatedState;
    });
  };

  //retun
  //=================================================
  //=================================================
  return (
    <div className="battle-area">
      <h3>전투 판정</h3>

      <input
        type="text"
        placeholder="캐릭터 이름"
        value={newCharacter}
        onChange={(e) => setNewCharacter(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <button onClick={addCharacter}>추가</button>

      <ul>
        {character.map((char, index) => (
          <li key={index} className="name">
            {char}
            <button className="xbutton" onClick={() => removeCharacter(index)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <p className="gubun">- - - - - - - - - - - - - - - - - - - - - - -</p>

      <input
        type="number"
        placeholder="좀비 수"
        onChange={onChangeZombie}
      ></input>

      {action.map((action, index) => (
        <div className="action" key={index}>
          {action.name}
          {"  "}

          <select
            className="battle-select"
            onChange={(e) => onChangeStat(e, index)}
          >
            <option value="bat">전투</option>
            <option value="agi">민첩</option>
            <option value="sec">은밀</option>
          </select>

          <select
            className="battle-select"
            onChange={(e) => onChangeValue(e, index)}
          >
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
            <option value={0}>0</option>
          </select>
        </div>
      ))}

      <button onClick={onClickBattle}>결과</button>

      <div className="result">
        <div dangerouslySetInnerHTML={{ __html: result }}></div>
        <br></br>
        <p className="zombie">남은 좀비: {zombie}</p>
      </div>

      <p className="gubun">- - - - - - - - - - - - - - - - - - - - - - -</p>
      <div className="turn-end">
        <input
          type="text"
          placeholder="어그로꾼"
          value={newAggro}
          onChange={(e) => setNewAggro(e.target.value)}
          onKeyPress={onKeyPressA}
        />
        <button onClick={addAggro}>추가</button>
        <ul>
          {aggro.map((char, index) => (
            <li key={index}>
              {char}{" "}
              <button className="xbutton" onClick={() => removeAggro(index)}>
                x
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onClickZombie}>좀비 공격</button>
        <div className="result">
          좀비가 달려든다.
          <br></br> <br></br>
          <div dangerouslySetInnerHTML={{ __html: resultZ }}></div>
        </div>

        <p className="gubun">- - - - - - - - - - - - - - - - - - - - - - -</p>

        {avoid.map((avoid, index) => (
          <div className="avoid" key={index}>
            {avoid} /{"  "}
            민첩
            {"  "}
            <select
              className="battle-select"
              onChange={(e) => onChangeAvoidV(e, index)}
            >
              <option value={5} selected>
                5
              </option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
              <option value={0}>0</option>
            </select>
          </div>
        ))}

        <button onClick={onClickAvoid}>회피 결과</button>
        <div className="result">
          회피 결과 <br></br> <br></br>
          <div dangerouslySetInnerHTML={{ __html: resultA }}></div>
        </div>

        {/* <p className="gubun">- - - - - - - - - - - - - - - - - - - - - - -</p>

        <div className="result">
          <div dangerouslySetInnerHTML={{ __html: resultH }}></div>
        </div> */}
      </div>
    </div>
  );
}

export default Battle;
