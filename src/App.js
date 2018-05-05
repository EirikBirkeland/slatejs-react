import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {Editor} from 'slate-react'
import {Value} from 'slate'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Type here and apply formatting.'
              }
            ]
          }
        ]
      }
    ]
  }
});

function CodeNode(props) {
  return (<pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>)
}

// Define a React component to render bold text with.
function BoldMark(props) {
  return <strong>{props.children}</strong>
}

function MarkHotkey(options) {
  const {type, key} = options
  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change) {
      // Check that the key pressed matches our `key` option.
      if (!event.ctrlKey || event.key != key)
        return
        // Prevent the default characters from being inserted.
      event.preventDefault()
      // Toggle the mark `type`.
      change.toggleMark(type)
      return true
    }
  }
}

const plugins = [
  MarkHotkey({key: 'b', type: 'bold'}),
  MarkHotkey({key: '`', type: 'code'}),
  MarkHotkey({key: 'i', type: 'italic'}),
  MarkHotkey({key: '~', type: 'strikethrough'}),
  MarkHotkey({key: 'u', type: 'underline'}),
  MarkHotkey({key: 'g', type: 'green'})
];

class App extends Component {

  state = {
    value: initialValue
  };

  onChange = ({value}) => {
    this.setState({value})
  };

  onKeyDown = (event, change) => {
    if (!event.ctrlKey)
      return
      // Decide what to do based on the key code...
    switch (event.key) {
        // When "B" is pressed, add a "bold" mark to the text.
      case 'b':
        {
          event.preventDefault()
          change.toggleMark('bold')
          return true
        }
        // When "`" is pressed, keep our existing code block logic.
      case '`':
        {
          const isCode = change.value.blocks.some(block => block.type == 'code')
          event.preventDefault()
          change.setBlocks(
            isCode
            ? 'paragraph'
            : 'code')
          return true
        }
    }
  }

  render() {
    return <div style={{
        'color' : 'white',
        'background-color' : 'black'
      }}>
      <Editor plugins={plugins} value={this.state.value} onChange={this.onChange} onKeyDown={this.onKeyDown} renderMark={this.renderMark}/>
      <br/>
      <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
    </div>
  }

  renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      case 'code':
        return <code>{props.children}</code>
      case 'italic':
        return <em>{props.children}</em>
      case 'strikethrough':
        return <del>{props.children}</del>
      case 'underline':
        return <u>{props.children}</u>
      case 'green':
        return <span style={{
            'color' : 'green'
        }}>{props.children}</span>
    }
  }
}

export default App;
