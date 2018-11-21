import React from 'react';

import Navigation from 'components/navigation';
import FlexContainer from 'primitives/flex-container';
import { AlertTriangle } from 'constants/icons';

import styles from './styles.module.scss';

export default function Home() {
  return (
    <Navigation>
      <FlexContainer direction="column" className={styles.container}>
        <div className={styles.placeholder}>
          <h1 className={styles.construction}>
            <AlertTriangle size="40" />
            <span>Site Under Construction</span>
          </h1>
          <p className={styles.text}>
            You are more than welcome to sign up and follow along with the
            development. Once authenticated you are able to import your decks
            directly from the official website to view and manage them.
          </p>
          <div className={styles.question}>
            Why build this when there is already a way to play online?
          </div>
          <p className={styles.text}>
            I really just want to play with technology that allows people to
            play an online card game together and I thought with my excitement
            for Keyforge this was the perfect time to start. Additionally, I
            don&#39;t just want to <i>play</i> keyforge. I want to learn and get
            better at keyforge. My goal for this website is to build in a{' '}
            <b>replay system</b> to help locate the moment the game when things
            went wrong and an <b>in-depth deck statistics</b> section as you
            play your decks online against your friends.
          </p>
          <p className={styles.text}>
            If this sounds at all interesting to you and would like to help out
            on the development side, the project is{' '}
            <a
              className={styles.link}
              href="https://github.com/mpigsley/keyforge-arena"
            >
              open source on Github.
            </a>
          </p>
        </div>
        <footer className={styles.footer}>
          <p>
            The information presented on this site about Keyforge, both literal
            and graphical, is copyrighted by Fantasy Flight Games and/or Wizards
            of the Coast.
          </p>
          <p>
            This website is not produced, endorsed, supported, or affiliated
            with Fantasy Flight Games and/or Wizards of the Coast.
          </p>
        </footer>
      </FlexContainer>
    </Navigation>
  );
}
