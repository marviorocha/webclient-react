
// Import internal modules
import BaseStore from './BaseStore';
import { mapSheetMusic } from '../utils/sheetMusicUtils';

// Export store
export default class SheetMusicStore extends BaseStore {

  constructor(flux) {
    super();

    const sheetMusicActions = flux.getActions('sheetmusic');
    this.register(sheetMusicActions.search, this.search);
    this.register(sheetMusicActions.getTrendingSheetMusic, this.getTrendingSheetMusic);
    this.register(sheetMusicActions.getMostPopularSheetMusic, this.getMostPopularSheetMusic);
    this.register(sheetMusicActions.getSheetMusicList, this.getSheetMusicList);

    this.state = {
      sheetMusic: {
        list: [],
        count: 0,
      },
      searchResults: {
        count: 0,
        free: [],
        paid: [],
      },
      mostPopularSheetMusic: [],
    };
  }

  // Process search results
  search(res) {
    let { count, free, paid } = JSON.parse(res.text);
    this.setState({
      searchResults: {
        count,
        free: mapSheetMusic(free),
        paid,
      },
    });
  }

  // Process trending sheet music
  getTrendingSheetMusic(res) {
    const results = JSON.parse(res.text);
    this.setState({
      sheetMusicList: {
        list: mapSheetMusic(results, result => result.sheetmusic),
        count: 0, // TODO(ankit): Add counts and pagination for trending page.
      }
    });
  }

  // Process browsing sheet music
  getSheetMusicList(res) {
    const { results, count } = JSON.parse(res.text);
    this.setState({
      sheetMusicList: {
        count,
        list: mapSheetMusic(results),
      },
    });
  }

  getMostPopularSheetMusic(res) {
    const { results } = JSON.parse(res.text);
    this.setState({
      mostPopularSheetMusic: mapSheetMusic(results),
    });
  }

}

