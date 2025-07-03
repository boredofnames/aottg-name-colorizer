import { pd } from '@js/utils.js'
import { effect } from 'pota'

export default function UserInput(props) {
	effect(() => {
		props.colors.placement = new Array(props.input().length).fill(
			null,
		)
	})
	return (
		<section>
			<h2>Input</h2>
			<form on:submit={pd}>
				<input use:bind={props.input} />
			</form>
		</section>
	)
}
