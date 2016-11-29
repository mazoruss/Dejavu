import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Header from './header';
import LandingPage from './landingPage';
import ContentList from './contentList';
import '../css/style.scss';

const URL = 'https://dejavu.ninja';
// const URL = 'http://localhost:3000';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      isLoggedIn: 'loading',
      expanded: -1,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.query = this.query.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  // Checks to see if the user is logged in
  componentDidMount() {
    $.ajax({
      url: `${URL}/api/web/checkLogIn`,
      method: 'GET',
      success: (isLoggedIn) => {
        this.setState({ isLoggedIn });
      },
    });
  }

  componentDidUpdate() {
    const regExpQuery = RegExp((this.state.query.match(/\S+/gi) || []).join('|'), 'gi');
    const html = $('p').html();
    if (html && `${regExpQuery}` !== '/(?:)/gi') {
      $('p').each((index, element) => {
        const context = $(element).text();
        $(element).html(context.replace(regExpQuery, '<span class="highlight">$&</span>'));
      });
    }
  }

  // Queries the server for search results
  handleChange(event) {
    const query = event.target.value;
    this.setState({ query });

    if (query.length > 1) {
      this.query(query);
    } else {
      this.setState({ results: [] });
    }
  }

  query(qs) {
    this.setState({ loading: true });

    $.ajax({
      url: `${URL}/api/web/search?q="${qs}"`,
      method: 'GET',
      success: (data) => {
        this.setState({ results: data.hits.hits, loading: false });
      },
    });
  }

  handleExpand(index) {
    this.setState({ expanded: index });
  }

  deleteItem(id) {
    const context = this;
    $.ajax({
      url: `${URL}/api/web/delete?id=${id}`,
      method: 'DELETE',
    })
    .done(() => {
      context.setState({ expanded: -1 });
      context.query(context.state.query);
    })
    .fail(() => {
      console.log('failed to delete in app.js');
    });
  }

  render() {
    return (
      <div>
        <Header
          query={this.state.query}
          handleChange={this.handleChange}
          isLoggedIn={this.state.isLoggedIn}
        />
        {this.state.isLoggedIn === false &&
          <LandingPage />
        }
        {this.state.isLoggedIn === true &&
          ((this.state.query.length < 2 || this.state.results.length || this.state.loading) ?
            <ContentList
              results={this.state.results}
              expanded={this.state.expanded}
              handleExpand={this.handleExpand}
              deleteItem={this.deleteItem}
            />
          : <div className="noContent">No Results</div>)
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
