import * as React from 'react'
import ReactWordcloud from 'react-wordcloud';
import * as lodash from 'lodash';

import firebase from "gatsby-plugin-firebase";
import "firebase/firestore";

import {useCallback, useEffect, useState} from "react";
import {Button, InputGroup, H1, Colors, Intent, ControlGroup} from "@blueprintjs/core";
import styled from 'styled-components';

import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

const COLORS_OUT = ['#FC4445', '#3FEEE6', '#55bcc9', '#97caef', '#cafafe'];

const options = {
  colors: COLORS_OUT,
  enableTooltip: true,
  deterministic: true,
  fontFamily: 'impact',
  fontSizes: [30, 45, 60],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
} as const;

const PageWrapper = styled.div`
  padding-left: 20%;
  padding-right: 20%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.WHITE};
`;

const WordCloudWrapper = styled.div`
  width: 100%;
  height: 400px;
`

const ControlGroupStyle = styled.div`
  display: flex;
  flex-direction: row;
`;

const HorizontalPadding = styled.div`
  width: 10px;
`;

export default (props: {}) => {
  const [db] = useState(() => firebase.firestore());

  const [results, setResults] = useState<Array<{ text: string, value: number }>>([]);
  const [newWord, setNewWord] = useState<string>("");

  const updateWordCloud = useCallback(() => {
    (async () => {
      const results = await db.collection("WordSubmission").get();
      const words: Array<string> = lodash.map(results.docs, d => d.data()['word']);
      const frequency: { [key: string]: number } = lodash.countBy(words);
      const data = lodash.values(lodash.mapValues(frequency, (value, key) => ({
        text: key,
        value: value
      })));
      setResults(data);
    })();
  }, [setResults, db]);

  const onTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWord(e.target.value);
  }, [setNewWord]);

  const onAddClick = useCallback(() => {
    (async () => {
      console.log('adding word: ' + newWord);
      const result = await db.collection("WordSubmission").add({
        word: newWord
      });
      setNewWord('');
      console.log('updating cloud');
      updateWordCloud();
    })();
  }, [db, newWord]);

  const resetAll = useCallback(() => {
    (async () => {
      const batch = db.batch();
      const docs = await db.collection('WordSubmission').get();
      docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      updateWordCloud();
    })();
  }, [db, updateWordCloud]);

  useEffect(() => {
    updateWordCloud();
  }, [updateWordCloud]);

  return (
      <PageWrapper className="$pt-elevation-shadow-2">
        <WordCloudWrapper className="$pt-elevation-shadow-2">
          <ReactWordcloud options={options as any} words={results} />
        </WordCloudWrapper>
        <ControlGroup fill vertical={false}>
          <InputGroup fill type="text" leftIcon="edit" value={newWord} onChange={onTextChange}/>
          <Button icon="add" onClick={onAddClick} />
          <Button icon="reset" onClick={resetAll} />
        </ControlGroup>
      </PageWrapper>
    )
}
