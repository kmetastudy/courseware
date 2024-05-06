const LogoUpload = (props) => {
    return `
        <p>${props.title}</p>
        <img class="w-[200px]" src="${props.img}"/>
        <input type="file" id="logoInput" />
        <button id="uploadBtn">업로드</button>
    `
}

export default LogoUpload