import { pd } from '@js/utils.js'
import { memo, ref } from 'pota'
import { For, Show } from 'pota/components'

export default function Output(props) {
	const splitInput = memo(() => props.input().split(''))
	const output = ref()
	function copy() {
		try {
			navigator.clipboard.writeText(output().value)
			props.setBanner(last => ({
				...last,
				message: 'Copied to clipboard',
				backgroundColor: 'green',
				color: 'white',
				duration: 10,
			}))
		} catch (error) {
			props.setBanner(last => ({
				...last,
				message: error,
				backgroundColor: 'red',
				color: 'white',
				duration: 10,
			}))
		}
	}
	return (
		<section>
			<h2>Output</h2>
			<form on:submit={pd}>
				<textarea use:ref={output}>
					<For each={splitInput} reactiveIndex>
						{(letter, i) => (
							<Show
								when={() =>
									letter !== ' ' && props.colors.placement[i()]
								}
								fallback={letter}
							>
								[{() => props.colors.placement[i()].slice(1)}]{letter}
							</Show>
						)}
					</For>
				</textarea>
				<button on:click={copy}>Copy</button>
			</form>
		</section>
	)
}
