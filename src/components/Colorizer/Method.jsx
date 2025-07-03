import { pd } from '@js/utils.js'

export default function Method(props) {
	console.log('method ran')
	function setMethod(e) {
		props.setMethod(e.target.value)
	}
	return (
		<section>
			<h2>Method</h2>
			<form on:submit={pd}>
				<select on:change={setMethod}>
					<option value="grad">Gradient</option>
					<option value="manual">Manual</option>
				</select>
			</form>
		</section>
	)
}
