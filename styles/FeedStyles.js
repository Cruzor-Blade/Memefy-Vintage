import styled from 'styled-components';

export const Container = styled.View`
  display:flex;
  flex: 1;
  align-items: center;
  background-color: #fff;
`;

export const Card = styled.View`
    background-color: #f8f8f8;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 10px;
    width:100%;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    padding: 8px;
    padding-left:12px;
`;

export const UserImg = styled.ImageBackground`
    width: 55px;
    height: 55px;
    align-items: center;
    justify-content: center;
    background-color: transparent;
`;

export const ProfileMask = styled.Image`
    width:55px;
    height:55px;
`

export const ProfileCropper = styled.Image`
    width: 58px;
    height: 58px;
    z-index: 2;
`

export const UserInfoText = styled.View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
`;

export const UserName = styled.Text`
    font-size: 14px;
    font-weight: bold;
    font-family: 'Lato-Regular';
`;

export const PostTime = styled.Text`
    font-size: 12px;
    font-family: 'Lato-Regular';
    color: #666;
`;

export const PostText = styled.Text`
    font-size: 16px;
    font-family: 'Lato-Regular';
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 4px;
`;

export const PostImg = styled.Image`
    width: 100%;
`;

export const Divider = styled.View`
    border-bottom-color: #dddddd;
    border-bottom-width: 1px;
    width: 92%;
    align-self: center;
    margin-top: 15px;
`;

export const InteractionWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const Interaction = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    border-radius: 5px;
    padding: 2px 5px;
    background-color: ${props => props.active ? '#2e64e515' : 'transparent'}
`;

export const InteractionText = styled.Text`
    font-size: 12px;
    font-family: 'Lato-Regular';
    font-weight: bold;
    color: ${props => props.active ? '#2e64e5' : '#333'};
    margin-top: 5px;
    margin-left: 5px;
`;
