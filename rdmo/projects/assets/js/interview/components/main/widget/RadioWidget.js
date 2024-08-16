import React from 'react'
import PropTypes from 'prop-types'

import { gatherOptions } from '../../../utils/options'

import QuestionAddValue from '../question/QuestionAddValue'
import QuestionCopyValue from '../question/QuestionCopyValue'
import QuestionDefault from '../question/QuestionDefault'
import QuestionError from '../question/QuestionError'
import QuestionSuccess from '../question/QuestionSuccess'
import QuestionEraseValue from '../question/QuestionEraseValue'
import QuestionRemoveValue from '../question/QuestionRemoveValue'

import RadioInput from './RadioInput'

const RadioWidget = ({ question, values, currentSet, disabled, createValue, updateValue, deleteValue, copyValue }) => {
  return (
    <div className="interview-widgets">
      {
        values.map((value, valueIndex) => {
          return (
            <div key={valueIndex} className="interview-widget">
              <RadioInput
                question={question}
                value={value}
                options={gatherOptions(question, currentSet)}
                disabled={disabled}
                updateValue={updateValue}
                buttons={
                  <div className="buttons">
                    <QuestionSuccess value={value}/>
                    <QuestionEraseValue value={value} disabled={disabled} updateValue={updateValue}/>
                    <QuestionRemoveValue
                      question={question}
                      values={values}
                      value={value}
                      disabled={disabled}
                      deleteValue={deleteValue}
                    />
                    <QuestionCopyValue question={question} value={value} copyValue={copyValue} />
                    <QuestionDefault question={question} value={value} />
                  </div>
                }
              />
              <QuestionError value={value} />
            </div>
          )
        })
      }
      <QuestionAddValue
        question={question}
        values={values}
        currentSet={currentSet}
        disabled={disabled}
        createValue={createValue}
        copyValue={copyValue}
      />
    </div>
  )
}

RadioWidget.propTypes = {
  question: PropTypes.object.isRequired,
  values: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  currentSet: PropTypes.object.isRequired,
  createValue: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  deleteValue: PropTypes.func.isRequired,
  copyValue: PropTypes.func.isRequired
}

export default RadioWidget
