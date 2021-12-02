import styled from 'styled-components';

export const InputWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #2e64e515;
`;

export const InputField = styled.TextInput`
    justify-content: center;
    align-items: center;
    font-size: 24px;
    text-align: center;
    width:90%;
    margin-bottom: 15px;
    position:   absolute;
`;

export const AddImage = styled.Image`
    width: 100%;
    margin-bottom: 15px;
    resize-mode: contain;
`;

export const StatusWrapper = styled.View`
    justify-content: center;
    align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    background-color: #2ec4e515;
    border-radius: 5px;
    border-color: #2e64e5;
    border-width: 1px;
    padding: 10px 25px;
    position: absolute;
    bottom:8px;
`;

export const SubmitBtnText = styled.Text`
    font-size: 18px;
    font-family: 'Lato-Bold';
    font-weight: bold;
    color: #2e64e5;
`;