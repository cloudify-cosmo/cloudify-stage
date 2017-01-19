/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class extends React.Component {
    render() {
        return (
            <div>
                <table className="ui very compact table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className='row'>
                                    <td><a href={item.html_url} target="_blank">{item.name}</a></td>
                                    <td>{item.description}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
