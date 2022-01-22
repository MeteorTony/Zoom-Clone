import React, {useState, useEffect, useContext} from 'react';
import Modal from 'react-modal';
import {Line} from 'rc-progress';

import {PollContext} from './PollContext';
import styles from './PollStyles';
import chatContext, {controlMessageEnum} from './ChatContext';

const Poll = () => {
  const {
    question,
    setQuestions,
    answers: voteData,
    setAnswers,
    isModalOpen,
    setIsModalOpen,
  } = useContext(PollContext);

  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const {sendControlMessage} = useContext(chatContext);

  useEffect(() => {
    if (voteData.length > 0) {
      setTotalVotes(
        voteData.map((item) => item.votes).reduce((prev, next) => prev + next), //sum up all votes by all users
      );
    }
  }, [voteData]);

  const submitVote = (e, chosenAnswer) => {
    if (!voted) {
      const newAnswers = voteData.map((answer) => {
        if (answer.option === chosenAnswer.option) {
          return {...answer, votes: answer.votes + 1};
        } else {
          return answer;
        }
      });

      setAnswers(newAnswers);
      sendControlMessage(controlMessageEnum.initiatePoll, {
        question,
        answers: newAnswers, // update new answer
      });
      setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);
      setVoted((prevVoted) => !prevVoted);
    }
  };

  // reset all states
  const closeModal = () => {
    setIsModalOpen(false);
    setTotalVotes(0);
    setVoted(false);
    setQuestions('');
    setAnswers([
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
    ]);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      content="Poll Modal"
      ariaHideApp={false}
      style={styles.customStyles}>
      <div>
        <h1>{question}</h1>
        <div style={styles.flexColumn}>
          {voteData &&
            voteData.map((answer, i) =>
              !voted ? (
                <button
                  style={styles.button}
                  key={i}
                  onClick={(e) => submitVote(e, answer)}>
                  {answer.option}
                </button>
              ) : (
                <div style={styles.flexCenter} key={i}>
                  <h2 style={styles.mr20}>{answer.option}</h2>
                  <Line
                    percent={(answer.votes / totalVotes) * 100}
                    strokeWidth="5"
                    trailWidth="3"
                  />
                  <p style={styles.ml20}>{answer.votes}</p>
                </div>
              ),
            )}
        </div>
        <h3>Total Votes: {totalVotes}</h3>
      </div>
    </Modal>
  );
};

export default Poll;
