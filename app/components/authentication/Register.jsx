
import classNames from 'classnames';
import defer from 'lodash/function/defer';
import fluxMixin from 'flummox/mixin';
import FontAwesome from 'react-fontawesome';
import includes from 'lodash/collection/includes';
import React from 'react';
import { addons } from 'react/addons';
import { Link } from 'react-router';

import { errors, success } from '../../utils/constants';
import { CanLoginMixin, AuthMessagesMixin, FacebookLoginMixin } from '../../utils/authUtils';

let { LinkedStateMixin } = addons;

export default React.createClass({

  mixins: [
    LinkedStateMixin,
    AuthMessagesMixin,
    CanLoginMixin,
    FacebookLoginMixin,
    fluxMixin({
      login: store => store.state,
      progress: store => store.state,
    }),
  ],

  getInitialState() {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
    };
  },

  componentDidMount() {
    this.refs.initFocus.getDOMNode().focus();
  },

  componentDidUpdate() {
    if (this.state.errorCode === success.REGISTERED) {
      defer(this.handlePostRegister_);
    }
  },

  render() {
    let error = this.state.errorCode;

    let registerInProgress = includes(this.state.inProgress, 'register') ||
                             includes(this.state.inProgress, 'login');
    let facebookInProgress = includes(this.state.inProgress, 'facebookLogin');

    // Assign the correct class names based on whether there's an error or not
    let classes = {
      username: classNames('authentication__input', {
        'authentication__input--error': error === errors.NO_USERNAME ||
                                        error === errors.USERNAME_TAKEN,
      }),
      email: classNames('authentication__input', {
        'authentication__input--error': error === errors.NO_EMAIL ||
                                        error === errors.INVALID_EMAIL ||
                                        error === errors.EMAIL_ALREADY_REGISTERED,
      }),
      password1: classNames('authentication__input', {
        'authentication__input--error': error === errors.NO_PASSWORD,
      }),
      password2: classNames('authentication__input', {
        'authentication__input--error': error === errors.NOT_SAME_PASSWORD,
      }),
    };

    return (
      <div>
        <div className="authentication__title">Sign up for PianoShelf</div>
        <If condition={error && error !== success.LOGGED_IN &&
            error !== success.REGISTERED &&
            !registerInProgress && !facebookInProgress}>
          <div className="authentication__error">
            <FontAwesome className="authentication__error-icon" name="exclamation-circle" size="lg" />
            {this.getErrorMessage(error)}
          </div>
        </If>
        <form className="authentication__form" onSubmit={this.handleSubmit_}>
          <div className="authentication__inputs">
            <input className={classes.username}
              type="text"
              ref="initFocus"
              placeholder="Username"
              valueLink={this.linkState('username')} />
            <input className={classes.email}
              type="text"
              placeholder="Email"
              valueLink={this.linkState('email')} />
            <input className={classes.password1}
              type="password"
              placeholder="Password"
              valueLink={this.linkState('password1')} />
            <input className={classes.password2}
              type="password"
              placeholder="Confirm Password"
              valueLink={this.linkState('password2')} />
          </div>
          <button className="authentication__button authentication__button--register"
            type="submit"
            disabled={registerInProgress || facebookInProgress}>
            <If condition={registerInProgress}>
              <FontAwesome name="cog" spin={true} />
            <Else />
              <span>
                <FontAwesome className="authentication__button-icon" name="star" />
                Sign up
              </span>
            </If>
          </button>
        </form>
        <Link to="/login" className="authentication__link">I have an account</Link>
        <hr className="authentication__hr" />
        <button className="authentication__button authentication__button--facebook"
          onClick={this.handleFacebook_}
          disabled={registerInProgress || facebookInProgress}>
          <If condition={facebookInProgress}>
            <FontAwesome name="cog" spin={true} />
          <Else />
            <span>
              <FontAwesome className="authentication__button-icon" name="facebook-square" />
              Sign up using Facebook
            </span>
          </If>
        </button>
      </div>
    );
  },

  handleSubmit_(event) {
    event.preventDefault();

    // Extract form values
    let { username, email, password1, password2 } = this.state;
    let newUser = { username, email, password1, password2 };

    // Trigger action
    let loginActions = this.flux.getActions('login');
    loginActions.register(newUser, this.flux);
  },

  handleFacebook_(event) {
    event.preventDefault();
    this.facebookLogin();
  },

  facebookLoginHandler(response) {
    if (response.status === 'connected') {
      let { accessToken } = response;

      // Trigger action
      let loginActions = this.flux.getActions('login');
      loginActions.facebookLogin({ accessToken }, this.flux);
    }
  },

  handlePostRegister_() {
    let { username, password1 } = this.state;

    // Trigger action
    let loginActions = this.flux.getActions('login');
    loginActions.login(username, password1, this.flux);
  },

});

