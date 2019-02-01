import React, { Component } from 'react';
import marked from 'marked';

class ReactMarkdown extends Component {
	constructor() {
		super();
		this.state = { html: '' };
	}

	componentDidMount() {
		fetch(this.props.md)
			.then(response => response.text())
			.then(markdown => this.setState({ html: marked(markdown) }));
	}

	render() {
		return (
			<div dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
		);
	}
}

export default ReactMarkdown;