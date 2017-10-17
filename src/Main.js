import React, { Component } from 'react';
import Button from 'react-toolbox/lib/button/Button';
import Header from './Header';
import Sidebar from './Sidebar';
import Flashcards from './Flashcards';
import FlashcardDialog from './FlashcardDialog';
import NewTagDialog from './NewTagDialog';
import * as utils from './utils';
import * as actions from './actions';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: null,
      tags: null,
      selectedTagId: null,
      flashcards: null,
      selectedFlashcardIndex: null,
      flashcardInDialog: null,
      tagInDialog: null
    };

    this.handleClickTag = this.handleClickTag.bind(this);
    this.handleClickPreviousFlashcard = this.handleClickPreviousFlashcard.bind(this);
    this.handleClickNextFlashcard = this.handleClickNextFlashcard.bind(this);
    this.handleCancelFlashcardDialog = this.handleCancelFlashcardDialog.bind(this);
    this.handleCreateFlashcard = this.handleCreateFlashcard.bind(this);
    this.handleEditFlashcard = this.handleEditFlashcard.bind(this);
    this.handleChangeFlashcard = this.handleChangeFlashcard.bind(this);
    this.handleSaveFlashcard = this.handleSaveFlashcard.bind(this);
    this.handleDeleteFlashcard = this.handleDeleteFlashcard.bind(this);

    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleSaveTag = this.handleSaveTag.bind(this);
    this.handleCancelTagDiag = this.handleCancelTagDiag.bind(this);
  }

  handleClickTag(tag) {
    this.setState({ selectedTagId: tag.id });
  }

  handleClickPreviousFlashcard() {
    this.setState(prevState => {
      return {
        selectedFlashcardIndex: Math.max(0, prevState.selectedFlashcardIndex - 1)
      };
    });
  }

  handleClickNextFlashcard() {
    this.setState(prevState => {
      return {
        selectedFlashcardIndex: Math.min(prevState.selectedFlashcardIndex + 1, prevState.flashcards.length - 1)
      };
    });
  }

  handleCancelFlashcardDialog() {
    this.setState({ flashcardInDialog: null });
  }

  handleCreateFlashcard() {
    const flashcard = {
      question: '',
      answer: '',
      tags: []
    };
    this.setState({ flashcardInDialog: flashcard });
  }

  handleEditFlashcard(flashcard) {
    this.setState({ flashcardInDialog: flashcard });
  }

  handleChangeFlashcard(field, value) {
    this.setState(prevState => {
      const { flashcardInDialog } = prevState;
      const newFlashcardInDialog = Object.assign(
        {},
        flashcardInDialog,
        { [field]: value }
      );
      return { flashcardInDialog: newFlashcardInDialog };
    });
  }

  handleSaveFlashcard(flashcard) {
    if (flashcard.id) {
      this.updateFlashcard(flashcard);
    } else {
      this.createFlashcard(flashcard);
    }
  }

  handleDeleteFlashcard(flashcard) {
    this.deleteFlashcard(flashcard);
  }

  // tags

  handleCreateTag() {
    const tag = {
      name: ''
    };

    this.setState({ tagInDialog: tag });
  }
  handleChangeTag(field, value) {
    this.setState(prevState => {
      const { tagInDialog } = prevState;
      const newTagInDialog = Object.assign(
        {},
        tagInDialog,
        { [field]: value }
      );
      return { tagInDialog: newTagInDialog };
    });
  }
  handleSaveTag(tag) {
      this.createTag(tag);
      this.setState({ tagInDialog: null });
  }

  handleCancelTagDiag() {
      this.setState({ tagInDialog: null });
  }


  componentDidMount() {
    this.fetchUserDetails();
    this.fetchTags();
  }

  componentDidUpdate(prevProps, prevState) {
    const currentTagId = this.state.selectedTagId;
    const prevTagId = prevState.selectedTagId;

    if (currentTagId === prevTagId || currentTagId == null) {
      return;
    }

    this.fetchFlashcards(currentTagId);
  }

  render() {
    const {
      info,
      tags,
      selectedTagId,
      flashcards,
      selectedFlashcardIndex,
      flashcardInDialog,
      tagInDialog
    } = this.state;

    return (
      <div className='Main'>
        <Header
          info={info}
        />
        <div className='Main-content'>
          <Sidebar
            tags={tags}
            onClickTag={this.handleClickTag}
            onClickNewTag={this.handleCreateTag}
          />
          <Flashcards
            tagId={selectedTagId}
            flashcards={flashcards}
            selectedFlashcardIndex={selectedFlashcardIndex}
            onClickPreviousFlashcard={this.handleClickPreviousFlashcard}
            onClickNextFlashcard={this.handleClickNextFlashcard}
            onClickEdit={this.handleEditFlashcard}
            onClickDelete={this.handleDeleteFlashcard}
          />
          <div className='Main-button'>
            <Button
              icon='add'
              floating
              accent
              onClick={this.handleCreateFlashcard}
            />
          </div>
        </div>
        <FlashcardDialog
          tags={tags}
          flashcard={flashcardInDialog}
          onChange={this.handleChangeFlashcard}
          onSave={this.handleSaveFlashcard}
          onCancel={this.handleCancelFlashcardDialog}
        />
        <NewTagDialog
          tag={tagInDialog}
          onChange={this.handleChangeTag}
          onSave={this.handleSaveTag}
          onCancel={this.handleCancelTagDiag}
        />
        
      </div>
    );
  }

  fetchUserDetails() {
    utils.fetchUserDetails({ token: this.props.token })
      .then(infos => {
        var info = infos.pop();
        this.setState({ info })
      });
  }

  //flashcards

  fetchFlashcards(tag) {
    utils.fetchFlashcards({ token: this.props.token, tag })
      .then(flashcards => {
        this.setState({ flashcards, selectedFlashcardIndex: 0 })
      });
  }

  createFlashcard(flashcard) {
    utils.createFlashcard({ token: this.props.token, flashcard })
      .then(flashcard => {
        this.setState(actions.createFlashcard.bind(null, flashcard));
      });
  }

  updateFlashcard(flashcard) {
    utils.updateFlashcard({ token: this.props.token, flashcard })
      .then(flashcard => {
        this.setState(actions.updateFlashcard.bind(null, flashcard));
      });
  }

  deleteFlashcard(flashcard) {
    utils.deleteFlashcard({ token: this.props.token, flashcard })
      .then(() => {
        this.setState(actions.deleteFlashcard.bind(null, flashcard));
      });
  }

  //tags
  fetchTags() {
    utils.fetchTags({ token: this.props.token })
      .then(tags => {
        this.setState({ tags })
      });
  }

  createTag(tag) {
    utils.createTag({ token: this.props.token, tag })
      .then(tag => {
        this.setState(actions.createTag.bind(null, tag));
      });
  }
}

export default Main;
