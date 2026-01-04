import type { VocabularyFormData } from '../types/vocabulary.types';

export const getEmptyVocabularyFormData = (): VocabularyFormData => ({
  word: '',
  wordImageFilename: '',
  wordImageOriginalUrl: '',
  simplePastTense: '',
  pastPerfectTense: '',
  translation: '',
  synonyms: '',
  pluralForm: '',
  phonetic: '',
  phoneticAudioFilename: '',
  phoneticAudioOriginalUrl: '',
  partOfSpeech: '',
  definition: '',
  example: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
  wordImageFile: null,
  phoneticAudioFile: null,
});
