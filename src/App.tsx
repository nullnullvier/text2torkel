import { ChangeEvent, useState } from 'react';
import './App.css'
import useWindowDimensions from './hooks/useWindowDimensions';

const App: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [formLock, setFormLock] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  
  const max: number = 250;
  const placeHolderText: string = "Text für die TTS"

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  };

  const handleClick = (value: string): void => {
    //set form on lock
    setFormLock(true)

    fetch('/api', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: value,
      })
    })
    .then(() => setFormLock(false))
    .catch((e) => console.log(e));

    //reset he textarea
    setValue("");
  }
  //resize teh textarea with the screensize without use autosize 
  const colsSize: number = width > 400 ? 50 : 30; 

  return (
    <>
    <a href="https://chaos.social/@text2torkel" target='_blank'><img src="assets/03f738deae3ce913.jpg" className='preferable' height="155" width="450" alt='MASTODON' /></a><br />
    <div className="description">
      <p>I'm a poorly trained, micro sized, resource efficient, voice clone text-to-speech model cyborg humunkulus narrating your life! Toot <a href="https://chaos.social/@text2torkel" title="text2torkel on Mastodon">@text2torkel</a> to get your personal message spoken.</p>
      <p><b>Find me at the Milliways assembly at 38c3.</b></p>
      <p>
        <a href="#tips"><i><b>Tips!</b></i></a>
        <div className="tips" id="tips">I work best with texts in German.<br />
        English words work if they are written in the way they sound in German.<br />
        Examples: "Hacker" = "Häcker", "Milliways" = "Milliwehs", "Backup" = "Bäck ab", ...<br />
        </div>
      </p>
      </div>
      <label>Texteingabe</label><br />
      <textarea
        id="text"
        name="text"
        minLength={4}
        maxLength={max}
        onChange={handleChange}
        value={value}
        placeholder={placeHolderText}
        rows={4}
        cols={colsSize}
        disabled={formLock}
      />
      <br />
      <small>{value.length} / {max}</small><br />
      <button onClick={() => handleClick(value)}>
        Submit
      </button>
    </>
  )
}

export default App
