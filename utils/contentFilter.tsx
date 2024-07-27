// utils/contentFilter.js

const inappropriateWords = [
  'asshole', 'bastard', 'bitch', 'cunt', 'fuck', 'motherfucker', 'nigger', 
  'pussy', 'shit', 'slut', 'whore', 'Nazi', 'fag', 'retard', 'rape', 
  'kill yourself', 'commit suicide'
];

  export function hasInappropriateContent(text: string): boolean {
    if (!text) return false;
  
    const regex = new RegExp('\\b(' + inappropriateWords.join('|') + ')\\b', 'gi');
    return regex.test(text);
  }
  
  export function filterInappropriateContent(text: string): string {
    if (!text) return '';
  
    const regex = new RegExp('\\b(' + inappropriateWords.join('|') + ')\\b', 'gi');
    return text.replace(regex, match => '*'.repeat(match.length));
  }